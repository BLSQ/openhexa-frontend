import { gql } from "@apollo/client";
import { PlayIcon, TrashIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

import DownloadPipelineVersion from "pipelines/features/DownloadPipelineVersion";
import Spinner from "core/components/Spinner";
import RunPipelineDialog from "workspaces/features/RunPipelineDialog";
import DeletePipelineDialog from "workspaces/features/DeletePipelineDialog";
import PipelineVersionPicker from "workspaces/features/PipelineVersionPicker";
import TabLayout from "../TabLayout";

type DatasetLayoutProps = {
  pipeline: any;
  workspace: any;
  currentTab?: string;
  extraBreadcrumbs?: { href: string; title: string }[];
  children: React.ReactNode;
};

const PipelineLayout = (props: DatasetLayoutProps) => {
  const {
    children,
    workspace,
    pipeline,
    currentTab = "general",
    extraBreadcrumbs = [],
  } = props;

  const { t } = useTranslation();
  const [isDeletePipelineDialogOpen, setDeletePipelineDialogOpen] =
    useState(false);

  return (
    <TabLayout
      workspace={workspace}
      helpLinks={[
        {
          label: t("About pipelines"),
          href: "https://github.com/BLSQ/openhexa/wiki/User-manual#using-pipelines",
        },
        {
          label: t("Writing OpenHEXA pipelines"),
          href: "https://github.com/BLSQ/openhexa/wiki/Writing-OpenHEXA-pipelines",
        },
      ]}
      item={pipeline}
      currentTab={currentTab}
      tabs={[
        {
          label: t("General"),
          href: `/workspaces/${encodeURIComponent(workspace.slug)}/pipelines/${encodeURIComponent(pipeline.code)}`,
          id: "general",
        },
        {
          label: t("Runs"),
          href: `/workspaces/${encodeURIComponent(workspace.slug)}/pipelines/${encodeURIComponent(pipeline.code)}/runs`,
          id: "runs",
        },
        {
          label: t("Scheduling & Notifications"),
          href: `/workspaces/${encodeURIComponent(workspace.slug)}/pipelines/${encodeURIComponent(pipeline.code)}/notifications`,
          id: "notifications",
        },
      ]}
    >
      <TabLayout.Header className="flex items-center justify-between gap-2">
        <Breadcrumbs withHome={false} className="flex-1">
          <Breadcrumbs.Part
            isFirst
            href={`/workspaces/${encodeURIComponent(workspace.slug)}`}
          >
            {workspace.name}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            href={`/workspaces/${encodeURIComponent(workspace.slug)}/pipelines`}
          >
            {t("Pipelines")}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            isLast={!extraBreadcrumbs.length}
            href={`/workspaces/${encodeURIComponent(
              workspace.slug,
            )}/pipelines/${encodeURIComponent(pipeline.code)}`}
          >
            {pipeline.name}
          </Breadcrumbs.Part>
          {extraBreadcrumbs.map(({ href, title }, index) => (
            <Breadcrumbs.Part
              key={index}
              isLast={extraBreadcrumbs.length - 1 == index}
              href={href}
            >
              {title}
            </Breadcrumbs.Part>
          ))}
        </Breadcrumbs>
        <div className="flex items-center gap-2">
          {pipeline.currentVersion && (
            <DownloadPipelineVersion version={pipeline.currentVersion}>
              {({ onClick, isDownloading }) => (
                <Button onClick={onClick} variant="secondary">
                  {isDownloading && <Spinner size="sm" />}
                  {t("Download code")}
                </Button>
              )}
            </DownloadPipelineVersion>
          )}
          {pipeline.permissions.run && (
            <RunPipelineDialog pipeline={pipeline}>
              {(onClick) => (
                <Button
                  leadingIcon={<PlayIcon className="w-4" />}
                  onClick={onClick}
                >
                  {t("Run")}
                </Button>
              )}
            </RunPipelineDialog>
          )}
          {pipeline.permissions.delete && (
            <Button
              onClick={() => setDeletePipelineDialogOpen(true)}
              className="bg-red-700 hover:bg-red-700 focus:ring-red-500"
              leadingIcon={<TrashIcon className="w-4" />}
            >
              {t("Delete")}
            </Button>
          )}
        </div>
      </TabLayout.Header>
      <TabLayout.PageContent>
        {children}
        <DeletePipelineDialog
          open={isDeletePipelineDialogOpen}
          onClose={() => setDeletePipelineDialogOpen(false)}
          pipeline={pipeline}
          workspace={workspace}
        />
      </TabLayout.PageContent>
    </TabLayout>
  );
};

PipelineLayout.fragments = {
  workspace: gql`
    fragment PipelineLayout_workspace on Workspace {
      ...WorkspaceLayout_workspace
    }
    ${WorkspaceLayout.fragments.workspace}
  `,
  pipeline: gql`
    fragment PipelineLayout_pipeline on Pipeline {
      id
      code
      name
      permissions {
        run
        delete
        update
      }
      currentVersion {
        id
        name
        description
        config
        externalLink
        ...PipelineVersionPicker_version
        ...DownloadPipelineVersion_version
      }
      ...RunPipelineDialog_pipeline
    }
    ${PipelineVersionPicker.fragments.version}
    ${DownloadPipelineVersion.fragments.version}
    ${RunPipelineDialog.fragments.pipeline}
  `,
};

export default PipelineLayout;
