import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  useWorkspaceDatasetPageQuery,
  WorkspaceDatasetFilePageDocument,
  WorkspaceDatasetFilePageQuery,
  WorkspaceDatasetFilePageQueryVariables,
  WorkspaceDatasetPageDocument,
  WorkspaceDatasetPageQuery,
  WorkspaceDatasetPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import { useEffect } from "react";
import useCacheKey from "core/hooks/useCacheKey";
import { trackEvent } from "core/helpers/analytics";
import DatasetExplorer from "datasets/features/DatasetExplorer";
import DatasetTabs from "datasets/features/DatasetTabs";
import DatasetLayout from "datasets/features/layouts/DatasetLayout";

type Props = {
  datasetSlug: string;
  workspaceSlug: string;
  versionId: string;
  isSpecificVersion: boolean;
  fileId: string;
};

const WorkspaceDatasetFilesPage: NextPageWithLayout = (props: Props) => {
  const { datasetSlug, workspaceSlug, isSpecificVersion, versionId, fileId } =
    props;

  const { t } = useTranslation();
  const router = useRouter();
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
  const version = dataset.version || dataset.latestVersion || null;

  return (
    <Page title={datasetLink.dataset.name ?? t("Dataset")}>
      <DatasetLayout datasetLink={data.datasetLink} workspace={workspace}>
        <DatasetTabs datasetLink={datasetLink} currentTab="files">
          {version ? (
            <DatasetExplorer version={version} fileId={fileId} />
          ) : (
            <p className={"italic text-gray-500"}>
              {t(
                "This dataset has no version. Upload a new version using your browser or the SDK to view your files.",
              )}
            </p>
          )}
        </DatasetTabs>
      </DatasetLayout>
    </Page>
  );
};

WorkspaceDatasetFilesPage.getLayout = (page) => page;

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

    const fileArr = (ctx.query.fileId as string[]) ?? [];
    if (fileArr.length > 1) {
      return { notFound: true };
    }

    const fileId = fileArr[0] ?? "";
    if (fileId) {
      const { data } = await client.query<
        WorkspaceDatasetFilePageQuery,
        WorkspaceDatasetFilePageQueryVariables
      >({
        query: WorkspaceDatasetFilePageDocument,
        variables: { fileId: fileId },
      });

      if (!data.datasetVersionFile) {
        return { notFound: true };
      }
    }

    return {
      props: { ...variables, fileId: fileId },
    };
  },
});

export default WorkspaceDatasetFilesPage;
