import { PlayIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import DataCard from "core/components/DataCard";
import TextProperty from "core/components/DataCard/TextProperty";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import ChevronLinkColumn from "core/components/DataGrid/ChevronLinkColumn";
import UserColumn from "core/components/DataGrid/UserColumn";
import Link from "core/components/Link";
import Page from "core/components/Page";
import Time from "core/components/Time";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { formatDuration } from "core/helpers/time";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import PipelineRunStatusBadge from "pipelines/features/PipelineRunStatusBadge";
import CronProperty from "workspaces/features/CronProperty";
import RenderProperty from "core/components/DataCard/RenderProperty";
import WorkspaceMemberProperty from "workspaces/features/WorkspaceMemberProperty/";
import {
  useWorkspacePipelinePageQuery,
  WorkspacePipelinePageDocument,
  WorkspacePipelinePageQuery,
  WorkspacePipelinePageQueryVariables,
} from "workspaces/graphql/queries.generated";
import { updatePipeline } from "workspaces/helpers/pipelines";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import PipelineVersionsDialog from "workspaces/features/PipelineVersionsDialog";
import RunPipelineDialog from "workspaces/features/RunPipelineDialog";
import { PipelineRecipient, PipelineRunTrigger } from "graphql-types";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import { useRouter } from "next/router";
import useCacheKey from "core/hooks/useCacheKey";
import Switch from "core/components/Switch/Switch";

type Props = {
  page: number;
  perPage: number;
  pipelineCode: string;
  workspaceSlug: string;
};

const WorkspacePipelinePage: NextPageWithLayout = (props: Props) => {
  const { pipelineCode, workspaceSlug, page, perPage } = props;
  const { t } = useTranslation();
  const [isVersionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [isRunPipelineDialogOpen, setRunPipelineDialogOpen] = useState(false);
  const router = useRouter();
  const { data, refetch } = useWorkspacePipelinePageQuery({
    variables: {
      workspaceSlug,
      pipelineCode,
      page,
      perPage,
    },
  });

  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(
    Boolean(data?.pipeline?.schedule)
  );
  const clearCache = useCacheKey(["pipelines", pipelineCode], () => refetch());
  // to prevent an "dirty read" from onSave function of isSchedulingEnabled state
  const isEnabledRef = useRef<boolean>();

  useEffect(() => {
    if (data?.pipeline?.schedule) {
      setIsSchedulingEnabled(true);
    }
  }, [data?.pipeline?.schedule]);

  useEffect(() => {
    isEnabledRef.current = isSchedulingEnabled;
  });

  if (!data?.workspace || !data?.pipeline) {
    return null;
  }
  const { workspace, pipeline } = data;

  const onSave = async (values: any) => {
    let schedule = null;
    let recipientIds = values.recipients.map(
      (r: PipelineRecipient) => r.user.id
    );

    if (isEnabledRef.current) {
      schedule = values.schedule;
    }
    await updatePipeline(pipeline.id, {
      name: values.name,
      description: values.description,
      schedule,
      recipientIds,
    });
    clearCache();
  };

  return (
    <Page title={pipeline.name ?? t("Pipeline run")}>
      <WorkspaceLayout workspace={workspace}>
        <WorkspaceLayout.Header>
          <div className="flex items-center justify-between">
            <Breadcrumbs withHome={false}>
              <Breadcrumbs.Part
                isFirst
                href={`/workspaces/${encodeURIComponent(workspace.slug)}`}
              >
                {workspace.name}
              </Breadcrumbs.Part>
              <Breadcrumbs.Part
                href={`/workspaces/${encodeURIComponent(
                  workspace.slug
                )}/pipelines`}
              >
                {t("Pipelines")}
              </Breadcrumbs.Part>
              <Breadcrumbs.Part
                isLast
                href={`/workspaces/${encodeURIComponent(
                  workspace.slug
                )}/pipelines/${encodeURIComponent(pipeline.code)}`}
              >
                {pipeline.name}
              </Breadcrumbs.Part>
            </Breadcrumbs>
            <div className="flex items-center gap-2">
              {pipeline.permissions.run && (
                <Button
                  leadingIcon={<PlayIcon className="w-4" />}
                  onClick={() => setRunPipelineDialogOpen(true)}
                >
                  {t("Run")}
                </Button>
              )}
            </div>
          </div>
        </WorkspaceLayout.Header>

        <WorkspaceLayout.PageContent className="space-y-6">
          <DataCard item={pipeline} className="divide-y-2 divide-gray-100">
            <DataCard.FormSection
              title={t("Information")}
              onSave={pipeline.permissions.update ? onSave : undefined}
              collapsible={false}
            >
              <TextProperty
                id="name"
                accessor={"name"}
                label={t("Name")}
                visible={(value, isEditing) => isEditing}
              />
              <TextProperty
                id="code"
                accessor={"code"}
                label={t("Code")}
                help={t(
                  "This is the code used to identify this pipeline using the cli."
                )}
                readonly
              />
              <TextProperty
                id="description"
                accessor={"description"}
                label={t("Description")}
                defaultValue="-"
                visible={(value, isEditing) => isEditing || value}
                hideLabel
                markdown
              />
              <RenderProperty<any>
                id="currentVersion"
                label={t("Current Version")}
              >
                {(property) =>
                  property.displayValue.currentVersion ? (
                    <div className="flex items-center gap-1.5">
                      {property.displayValue.currentVersion.number}
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => setVersionsDialogOpen(true)}
                      >
                        {t("See all")}
                      </Button>
                    </div>
                  ) : (
                    <span>{t("No version")}</span>
                  )
                }
              </RenderProperty>
            </DataCard.FormSection>
            <DataCard.FormSection
              title={t("Scheduling")}
              onSave={pipeline.permissions.update ? onSave : undefined}
              collapsible={false}
              validate={isSchedulingEnabled}
            >
              <RenderProperty<any> id="enableScheduling" label={t("Enabled")}>
                {(property, section) => (
                  <Switch
                    name="enable_schedule"
                    checked={isSchedulingEnabled}
                    onChange={() => setIsSchedulingEnabled((value) => !value)}
                    disabled={!section.isEdited}
                  />
                )}
              </RenderProperty>

              <>
                <CronProperty
                  id="schedule"
                  accessor="schedule"
                  label={t("Cron expression")}
                  defaultValue={t("Manual")}
                  required
                  visible={isSchedulingEnabled}
                />
                <WorkspaceMemberProperty
                  id="recipients"
                  label={t("Notification repicients")}
                  accessor={(pipeline) => pipeline.recipients}
                  slug={workspace.slug}
                  defaultValue="-"
                  visible={isSchedulingEnabled}
                />
              </>
            </DataCard.FormSection>
          </DataCard>

          <div>
            <Title level={4} className="font-medium">
              {t("Runs")}
            </Title>
            <Block>
              <DataGrid
                defaultPageSize={perPage}
                data={pipeline.runs.items}
                totalItems={pipeline.runs.totalItems}
                fixedLayout={false}
                fetchData={({ page, pageSize }) => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      page,
                      perPage: pageSize,
                    },
                  });
                }}
              >
                <BaseColumn id="name" label={t("Executed on")}>
                  {(item) => (
                    <Link
                      customStyle="text-gray-700 font-medium"
                      href={{
                        pathname:
                          "/workspaces/[workspaceSlug]/pipelines/[pipelineCode]/runs/[runId]",
                        query: {
                          pipelineCode: pipeline.code,
                          workspaceSlug: workspace.slug,
                          runId: item.id,
                        },
                      }}
                    >
                      <Time datetime={item.executionDate} />
                    </Link>
                  )}
                </BaseColumn>
                <BaseColumn<PipelineRunTrigger>
                  label={t("Trigger")}
                  accessor="trigger"
                >
                  {(value) => (
                    <span>
                      {value === PipelineRunTrigger.Scheduled
                        ? t("Scheduled")
                        : t("Manual")}
                    </span>
                  )}
                </BaseColumn>
                <BaseColumn label={t("Status")} id="status">
                  {(item) => <PipelineRunStatusBadge run={item} />}
                </BaseColumn>
                <TextColumn accessor="version.number" label={t("Version")} />
                <BaseColumn label={t("Duration")} accessor="duration">
                  {(value) => (
                    <span suppressHydrationWarning>
                      {value ? formatDuration(value) : "-"}
                    </span>
                  )}
                </BaseColumn>
                <UserColumn label={t("User")} accessor="user" />
                <ChevronLinkColumn
                  accessor="id"
                  url={(value: any) => ({
                    pathname:
                      "/workspaces/[workspaceSlug]/pipelines/[pipelineCode]/runs/[runId]",
                    query: {
                      workspaceSlug: workspace.slug,
                      pipelineCode: pipeline.code,
                      runId: value,
                    },
                  })}
                />
              </DataGrid>
            </Block>
          </div>
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
      <PipelineVersionsDialog
        pipeline={pipeline}
        open={isVersionsDialogOpen}
        onClose={() => setVersionsDialogOpen(false)}
      />
      <RunPipelineDialog
        open={isRunPipelineDialogOpen}
        onClose={() => setRunPipelineDialogOpen(false)}
        pipeline={pipeline}
      />
    </Page>
  );
};

WorkspacePipelinePage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    await WorkspaceLayout.prefetch(ctx, client);
    const page = parseInt(ctx.query.page as string, 10) || 1;
    const perPage = parseInt(ctx.query.perPage as string, 10) || 5;
    const { data } = await client.query<
      WorkspacePipelinePageQuery,
      WorkspacePipelinePageQueryVariables
    >({
      query: WorkspacePipelinePageDocument,
      variables: {
        workspaceSlug: ctx.params!.workspaceSlug as string,
        pipelineCode: ctx.params!.pipelineCode as string,
        page,
        perPage,
      },
    });

    if (!data.workspace || !data.pipeline) {
      return { notFound: true };
    }
    return {
      props: {
        workspaceSlug: ctx.params!.workspaceSlug,
        pipelineCode: ctx.params!.pipelineCode,
        page,
        perPage,
      },
    };
  },
});

export default WorkspacePipelinePage;
