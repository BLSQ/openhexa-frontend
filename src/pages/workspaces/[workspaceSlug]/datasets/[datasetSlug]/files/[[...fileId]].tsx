import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button/Button";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import DatasetVersionPicker from "datasets/features/DatasetVersionPicker/DatasetVersionPicker";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  useWorkspaceDatasetPageQuery,
  WorkspaceDatasetPageDocument,
  WorkspaceDatasetPageQuery,
  WorkspaceDatasetPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import { useEffect, useState } from "react";
import { updateDataset } from "datasets/helpers/dataset";
import UploadDatasetVersionDialog from "datasets/features/UploadDatasetVersionDialog";
import PinDatasetButton from "datasets/features/PinDatasetButton";
import LinkDatasetDialog from "datasets/features/LinkDatasetDialog";
import useCacheKey from "core/hooks/useCacheKey";
import DeleteDatasetTrigger from "datasets/features/DeleteDatasetTrigger";
import { trackEvent } from "core/helpers/analytics";
import Block from "core/components/Block";
import DatasetExplorer from "datasets/features/DatasetExplorer";
import { capitalize } from "lodash";
import DatasetTabs from "datasets/features/DatasetTabs";

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

  const onChangeVersion: React.ComponentProps<
    typeof DatasetVersionPicker
  >["onChange"] = (version) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, version: version?.id },
    });
  };

  if (!data?.datasetLink) {
    return null;
  }
  const { datasetLink } = data;
  const { dataset, workspace } = datasetLink;
  const isWorkspaceSource = workspace.slug === dataset.workspace?.slug;
  const version = dataset.version || dataset.latestVersion || null;

  const onSave = async (values: any) => {
    await updateDataset(datasetLink.dataset.id, values);
  };

  return (
    <Page title={datasetLink.dataset.name ?? t("Dataset")}>
      <WorkspaceLayout
        workspace={workspace}
        helpLinks={[
          {
            label: t("About datasets"),
            href: "https://github.com/BLSQ/openhexa/wiki/User-manual#datasets",
          },
          {
            label: t("Using the OpenHEXA SDK with datasets"),
            href: "https://github.com/BLSQ/openhexa/wiki/Using-the-OpenHEXA-SDK#working-with-datasets",
          },
        ]}
      >
        <WorkspaceLayout.Header className="flex items-center justify-between gap-2">
          <Breadcrumbs withHome={false} className="flex-1">
            <Breadcrumbs.Part
              isFirst
              href={`/workspaces/${encodeURIComponent(workspace.slug)}`}
            >
              {workspace.name}
            </Breadcrumbs.Part>
            <Breadcrumbs.Part
              href={`/workspaces/${encodeURIComponent(
                workspace.slug,
              )}/datasets`}
            >
              {t("Datasets")}
            </Breadcrumbs.Part>
            <Breadcrumbs.Part
              isLast
              href={`/workspaces/${encodeURIComponent(
                workspace.slug,
              )}/datasets/${encodeURIComponent(datasetLink.id)}`}
            >
              {datasetLink.dataset.name}
            </Breadcrumbs.Part>
          </Breadcrumbs>
          <PinDatasetButton link={datasetLink} />
          {datasetLink.dataset.permissions.createVersion &&
            isWorkspaceSource && (
              <Button
                leadingIcon={<PlusIcon className="h-4 w-4" />}
                onClick={() => setUploadDialogOpen(true)}
              >
                {t("Create new version")}
              </Button>
            )}
          {isWorkspaceSource && datasetLink.dataset.permissions.delete && (
            <DeleteDatasetTrigger
              dataset={datasetLink.dataset}
              onDelete={() =>
                router.push({
                  pathname: "/workspaces/[workspaceSlug]/datasets",
                  query: { workspaceSlug: workspace.slug },
                })
              }
            >
              {({ onClick }) => (
                <Button
                  variant={"danger"}
                  onClick={onClick}
                  leadingIcon={<TrashIcon className="w-4" />}
                >
                  {t("Delete")}
                </Button>
              )}
            </DeleteDatasetTrigger>
          )}
        </WorkspaceLayout.Header>
        <WorkspaceLayout.PageContent>
          <Block className="py-4 min-h-[70vh]">
            <Block.Header className="flex gap-4 items-center justify-between">
              {capitalize(datasetLink.dataset.name)}
              {version && (
                <DatasetVersionPicker
                  onChange={onChangeVersion}
                  dataset={datasetLink.dataset}
                  version={version}
                  className="w-40"
                />
              )}
            </Block.Header>
            <Block.Content className="space-y-2">
              <DatasetTabs
                datasetSlug={datasetSlug}
                workspaceSlug={workspaceSlug}
                currentTab="files"
                isWorkspaceSource={isWorkspaceSource}
                version={version}
              >
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
            </Block.Content>
          </Block>
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>

      <UploadDatasetVersionDialog
        open={isUploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        datasetLink={datasetLink}
      />
      <LinkDatasetDialog
        dataset={datasetLink.dataset}
        open={isLinkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
      />
    </Page>
  );
};

WorkspaceDatasetFilesPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const versionId = (ctx.query.version as string) ?? "";
    const fileArr = (ctx.query.fileId as string[]) ?? [];
    const fileId = fileArr[0] ?? "";

    const variables = {
      workspaceSlug: ctx.params!.workspaceSlug as string,
      datasetSlug: ctx.params!.datasetSlug as string,
      versionId: versionId,
      isSpecificVersion: Boolean(versionId),
      fileId: fileId,
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

    if (fileArr.length > 1) {
      return { notFound: true };
    }

    return {
      props: { ...variables },
    };
  },
});

export default WorkspaceDatasetFilesPage;
