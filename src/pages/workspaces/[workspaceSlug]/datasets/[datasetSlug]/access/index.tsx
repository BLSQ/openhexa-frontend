import Button from "core/components/Button/Button";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
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
import DatasetLinksDataGrid from "datasets/features/DatasetLinksDataGrid";
import DatasetLayout from "datasets/layouts/DatasetLayout";
import LinkDatasetDialog from "datasets/features/LinkDatasetDialog";

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
      <DatasetLayout
        datasetLink={data.datasetLink}
        workspace={workspace}
        extraBreadcrumbs={[
          {
            title: t("Access Management"),
            href: `/workspaces/${encodeURIComponent(
              workspace.slug,
            )}/datasets/${encodeURIComponent(datasetLink.dataset.slug)}/access`,
          },
        ]}
      >
        <div className="space-y-4">
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
          <div>
            <DatasetLinksDataGrid dataset={datasetLink.dataset} />
          </div>
        </div>
      </DatasetLayout>
      <LinkDatasetDialog
        dataset={datasetLink.dataset}
        open={isLinkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
      />
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
