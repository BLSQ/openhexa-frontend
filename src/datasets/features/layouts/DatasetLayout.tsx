import Breadcrumbs from "core/components/Breadcrumbs";
import { useTranslation } from "react-i18next";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import { WorkspaceLayoutProps } from "workspaces/layouts/WorkspaceLayout/WorkspaceLayout";
import PinDatasetButton from "../PinDatasetButton";
import LinkDatasetDialog from "../LinkDatasetDialog";
import UploadDatasetVersionDialog from "../UploadDatasetVersionDialog";
import Button from "core/components/Button";
import DeleteDatasetTrigger from "../DeleteDatasetTrigger";
import { useRouter } from "next/router";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { WorkspaceDatasetPageQuery } from "workspaces/graphql/queries.generated";
import DatasetVersionPicker from "../DatasetVersionPicker";
import Block from "core/components/Block";
import { capitalize } from "lodash";

type DatasetLayoutProps = {
  datasetLink: WorkspaceDatasetPageQuery["datasetLink"];
} & WorkspaceLayoutProps;

const DatasetLayout = (props: DatasetLayoutProps) => {
  const { children, datasetLink, workspace } = props;

  const { t } = useTranslation();
  const router = useRouter();
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);

  const onChangeVersion: React.ComponentProps<
    typeof DatasetVersionPicker
  >["onChange"] = (version) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, version: version?.id },
    });
  };

  if (!datasetLink) {
    return null;
  }

  const { dataset } = datasetLink;
  const isWorkspaceSource = workspace.slug === dataset.workspace?.slug;
  const version = dataset.version || dataset.latestVersion || null;

  return (
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
            href={`/workspaces/${encodeURIComponent(workspace.slug)}/datasets`}
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
        {dataset.permissions.createVersion && isWorkspaceSource && (
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
          <Block.Content className="space-y-2">{children}</Block.Content>
        </Block>
      </WorkspaceLayout.PageContent>
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
    </WorkspaceLayout>
  );
};
export default DatasetLayout;
