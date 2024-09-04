import Button from "core/components/Button/Button";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  useWorkspaceDatasetPageQuery,
  WorkspaceDatasetPageDocument,
  WorkspaceDatasetPageQuery,
  WorkspaceDatasetPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import { useEffect, useState } from "react";
import { LinkIcon } from "@heroicons/react/24/solid";
import useCacheKey from "core/hooks/useCacheKey";
import { trackEvent } from "core/helpers/analytics";
import DatasetTabs from "datasets/features/DatasetTabs/DatasetTabs";
import DatasetLinksDataGrid from "datasets/features/DatasetLinksDataGrid";
import DatasetLayout from "datasets/features/layouts/DatasetLayout";

export type WorkspaceDatabasePageProps = {
  datasetSlug: string;
  workspaceSlug: string;
  versionId: string;
  isSpecificVersion: boolean;
  tabIndex: number;
};

const WorkspaceDatasetAccessManagementPage: NextPageWithLayout = (
  props: WorkspaceDatabasePageProps,
) => {
  const { datasetSlug, workspaceSlug, isSpecificVersion, versionId, tabIndex } =
    props;

  const { t } = useTranslation();
  const router = useRouter();
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);
  const { data, refetch } = useWorkspaceDatasetPageQuery({
    variables: {
      workspaceSlug,
      datasetSlug,
      versionId,
      isSpecificVersion,
    },
  });
  useCacheKey(["datasets"], () => refetch());

  useEffect(() => {
    if (data?.datasetLink) {
      const version = dataset.version || dataset.latestVersion || null;
      trackEvent("datasets.dataset_open", {
        workspace: workspaceSlug,
        dataset_id: datasetSlug,
        dataset_version: version?.name,
      });
    }
  }, []);

  if (!data?.datasetLink) {
    return null;
  }
  const { datasetLink } = data;
  const { dataset, workspace } = datasetLink;

  return (
    <Page title={datasetLink.dataset.name ?? t("Dataset")}>
      <DatasetLayout datasetLink={data.datasetLink} workspace={workspace}>
        <DatasetTabs datasetLink={datasetLink} currentTab="management">
          <>
            <div className={"flex flex justify-end"}>
              {workspace.permissions.update && (
                <Button
                  leadingIcon={<LinkIcon className={"h-4 w-4"} />}
                  onClick={() => setLinkDialogOpen(true)}
                >
                  {t("Share with a workspace")}
                </Button>
              )}
            </div>
            <div className={"-mx-6"}>
              <DatasetLinksDataGrid dataset={datasetLink.dataset} />
            </div>
          </>
        </DatasetTabs>
      </DatasetLayout>
    </Page>
  );
};

WorkspaceDatasetAccessManagementPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const versionId = (ctx.query.version as string) ?? "";

    const variables = {
      workspaceSlug: ctx.params!.workspaceSlug as string,
      datasetSlug: ctx.params!.datasetSlug as string,
      versionId: versionId,
      isSpecificVersion: Boolean(versionId),
    };

    const { data } = await client.query<
      WorkspaceDatasetPageQuery,
      WorkspaceDatasetPageQueryVariables
    >({
      query: WorkspaceDatasetPageDocument,
      variables,
    });

    if (!data.datasetLink) {
      return { notFound: true };
    }

    return {
      props: variables,
    };
  },
});

export default WorkspaceDatasetAccessManagementPage;
