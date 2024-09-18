import Breadcrumbs from "core/components/Breadcrumbs";
import { useTranslation } from "react-i18next";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import { WorkspaceLayoutProps } from "workspaces/layouts/WorkspaceLayout/WorkspaceLayout";
import PinDatasetButton from "../features/PinDatasetButton";
import UploadDatasetVersionDialog from "../features/UploadDatasetVersionDialog";
import Button from "core/components/Button";
import DeleteDatasetTrigger from "../features/DeleteDatasetTrigger";
import { useRouter } from "next/router";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { WorkspaceDatasetPageQuery } from "workspaces/graphql/queries.generated";
import DatasetVersionPicker from "../features/DatasetVersionPicker";
import Block from "core/components/Block";
import { capitalize } from "lodash";
import Link, { LinkProps } from "core/components/Link";
import clsx from "clsx";

const TabLink = (
  props: LinkProps & {
    className: string;
    selected?: boolean;
    label: string;
  },
) => {
  const { selected, label, ...rest } = props;
  return (
    <Link
      {...rest}
      className={clsx(
        "cursor-pointer whitespace-nowrap border-b-2 px-1.5 py-2.5 tracking-wide",
        selected
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
      )}
    >
      {label}
    </Link>
  );
};

type DatasetLayoutProps = {
  datasetLink: WorkspaceDatasetPageQuery["datasetLink"];
  tab: string;
  extraBreadcrumbs?: { href: string; title: string }[];
} & WorkspaceLayoutProps;

const DatasetLayout = (props: DatasetLayoutProps) => {
  const {
    children,
    datasetLink,
    workspace,
    tab,
    extraBreadcrumbs = [],
  } = props;

  const { t } = useTranslation();
  const router = useRouter();
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  const onChangeVersion: React.ComponentProps<
    typeof DatasetVersionPicker
  >["onChange"] = (version) => {
    delete router.query["fileId"];
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
            isLast={!extraBreadcrumbs.length}
            href={`/workspaces/${encodeURIComponent(
              workspace.slug,
            )}/datasets/${encodeURIComponent(datasetLink.dataset.slug)}`}
          >
            {datasetLink.dataset.name}
          </Breadcrumbs.Part>
          {extraBreadcrumbs?.map((breadcrumbsPart, index) => (
            <Breadcrumbs.Part
              key={index}
              isLast={extraBreadcrumbs.length - 1 == index}
              href={breadcrumbsPart.href}
            >
              {breadcrumbsPart.title}
            </Breadcrumbs.Part>
          ))}
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
          <Block.Header className="flex gap-4 items-center justify-between capitalize">
            {datasetLink.dataset.name}
            {version && (
              <DatasetVersionPicker
                onChange={onChangeVersion}
                dataset={datasetLink.dataset}
                version={version}
                className="w-40"
              />
            )}
          </Block.Header>
          <Block.Content className="space-y-4">
            <div className="flex space-x-8 border-b border-gray-200 text-sm font-medium">
              <TabLink
                href={{
                  pathname:
                    "/workspaces/[workspaceSlug]/datasets/[datasetSlug]",
                  query: {
                    workspaceSlug: workspace.slug,
                    datasetSlug: dataset.slug,
                  },
                }}
                className="whitespace-nowrap border-b-2 px-1.5 py-2.5 tracking-wide border-blue-500 text-blue-600"
                label={t("Description")}
                selected={tab == "description"}
              />
              <TabLink
                href={{
                  pathname:
                    "/workspaces/[workspaceSlug]/datasets/[datasetSlug]/files",
                  query: {
                    workspaceSlug: workspace.slug,
                    datasetSlug: dataset.slug,
                  },
                }}
                selected={tab == "files"}
                className="whitespace-nowrap border-b-2 px-1.5 py-2.5 tracking-wide border-blue-500 text-blue-600"
                role="tab"
                label={t("Data files")}
              >
                {t("Data files")}
              </TabLink>
              {isWorkspaceSource && (
                <TabLink
                  href={{
                    pathname:
                      "/workspaces/[workspaceSlug]/datasets/[datasetSlug]/access",
                    query: {
                      workspaceSlug: workspace.slug,
                      datasetSlug: dataset.slug,
                    },
                  }}
                  className="whitespace-nowrap border-b-2 px-1.5 py-2.5 tracking-wide border-blue-500 text-blue-600"
                  role="tab"
                  selected={tab == "access"}
                  label={t("Access management")}
                />
              )}
            </div>
            {children}
          </Block.Content>
        </Block>
      </WorkspaceLayout.PageContent>
      <UploadDatasetVersionDialog
        open={isUploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        datasetLink={datasetLink}
      />
    </WorkspaceLayout>
  );
};
export default DatasetLayout;
