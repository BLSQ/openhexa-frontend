import { PlayIcon } from "@heroicons/react/24/outline";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import ChevronLinkColumn from "core/components/DataGrid/ChevronLinkColumn";
import DateColumn from "core/components/DataGrid/DateColumn";
import UserColumn from "core/components/DataGrid/UserColumn";
import DescriptionList from "core/components/DescriptionList";
import Dialog from "core/components/Dialog";
import Checkbox from "core/components/forms/Checkbox";
import Field from "core/components/forms/Field";
import Link from "core/components/Link";
import Page from "core/components/Page";
import Tabs from "core/components/Tabs";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { formatDuration } from "core/helpers/time";
import { NextPageWithLayout } from "core/helpers/types";
import { Dag } from "graphql-types";
import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PipelineRunStatusBadge from "pipelines/features/PipelineRunStatusBadge";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  useWorkspacePipelinePageQuery,
  WorkspacePipelinePageDocument,
} from "workspaces/graphql/queries.generated";
import { FAKE_WORKSPACE } from "workspaces/helpers/fixtures";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

const ConfigurePipelineModal = ({
  open,
  dag,
  onClose,
}: {
  dag: Pick<Dag, "description">;
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-4xl" centered={false}>
      <Dialog.Title>{t("Run")}</Dialog.Title>
      <Dialog.Content className="grid grid-cols-2 gap-x-5">
        <div className="row-span-2">
          <form className="grid grid-cols-2 gap-4">
            <Field
              name="start_date"
              type="date"
              required
              id="start_date"
              label={t("From date")}
            />
            <Field
              name="end_date"
              type="date"
              required
              id="end_date"
              label={t("To date")}
            />

            <Checkbox name="generate_extract" label={t("Generate extract")} />
            <Checkbox
              name="reuse_existing_extract"
              label={t("Re-use existing extract")}
            />
            <Checkbox name="update_dhis2" label={t("Update DHIS2")} />
            <Checkbox name="update_dashboard" label={t("Update dashboard")} />
          </form>
        </div>
        <div>
          {dag.description && (
            <>
              <Title level={3} className="font-medium text-gray-900">
                {t("Description")}
              </Title>
              <ReactMarkdown className="prose max-w-3xl text-sm">
                {dag.description}
              </ReactMarkdown>
            </>
          )}
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={onClose}>{t("Run")}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

type Props = {
  page: number;
  perPage: number;
};

const WorkspacePipelinePage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const { data } = useWorkspacePipelinePageQuery({
    variables: { workspaceSlug: router.query.workspaceSlug as string },
  });

  if (!data?.workspace) {
    return null;
  }
  const { workspace } = data;

  const dag = FAKE_WORKSPACE.dags.find((d) => d.id === router.query.pipelineId);

  if (!dag) {
    return null;
  }

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <Page title={t("Workspace")}>
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
              )}/pipelines/${encodeURIComponent(dag.id)}`}
            >
              {dag.label}
            </Breadcrumbs.Part>
          </Breadcrumbs>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenModal}
              leadingIcon={<PlayIcon className="w-4" />}
            >
              {t("Run")}
            </Button>
          </div>
        </div>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent className="space-y-6">
        <div>
          <Block className="divide-y-2 divide-gray-100">
            <Block.Content>
              <ReactMarkdown className="prose">{dag.description}</ReactMarkdown>
            </Block.Content>
            <Block.Section>
              <DescriptionList>
                <DescriptionList.Item label={t("Schedule")}>
                  Run every 12 hours
                </DescriptionList.Item>
              </DescriptionList>
            </Block.Section>
            <Block.Section collapsible title={t("External API")}>
              <p className="mb-2">
                This pipeline can be called externally to be executed.
              </p>
              <Tabs>
                <Tabs.Tab label={t("curl")}>
                  <pre className="bg-gray-50 px-4 py-4 text-sm">
                    curl -X POST {router.pathname + "/execute"}
                  </pre>
                </Tabs.Tab>
                <Tabs.Tab label={t("Python")}>
                  <pre className="bg-gray-50 px-4 py-4 text-sm">
                    import requests
                    <br />
                    response = requests.post(&quot;
                    {router.pathname + "/execute"}&quot;)
                  </pre>
                </Tabs.Tab>
              </Tabs>
            </Block.Section>
          </Block>
        </div>

        <div>
          <Title level={4} className="font-medium">
            {t("Runs")}
          </Title>
          <Block>
            <DataGrid
              defaultPageSize={props.perPage}
              data={dag.runs}
              totalItems={dag.runs.length}
              fixedLayout={false}
            >
              <BaseColumn id="name" label={t("Name")}>
                {(item) => (
                  <Link
                    customStyle="text-gray-700 font-medium"
                    href={{
                      pathname:
                        "/workspaces/[workspaceSlug]/pipelines/[pipelinesId]",
                      query: {
                        pipelinesId: item.id,
                        workspaceSlug: workspace.slug,
                      },
                    }}
                  >
                    {item.label || item.externalId}
                  </Link>
                )}
              </BaseColumn>
              <DateColumn
                label={t("Executed on")}
                format={DateTime.DATETIME_SHORT}
                accessor="executionDate"
              />
              <BaseColumn label={t("Status")} id="status">
                {(item) => <PipelineRunStatusBadge dagRun={item} />}
              </BaseColumn>
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
                    "/workspaces/[workspaceSlug]/pipelines/[pipelinesId]/runs/[runId]",
                  query: {
                    workspaceSlug: workspace.slug,
                    pipelinesId: dag.id,
                    runId: value,
                  },
                })}
              />
            </DataGrid>
            <ConfigurePipelineModal
              dag={dag}
              open={openModal}
              onClose={() => setOpenModal(!openModal)}
            />
          </Block>
        </div>
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

WorkspacePipelinePage.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const { data } = await client.query({
      query: WorkspacePipelinePageDocument,
      variables: { workspaceSlug: ctx.params?.workspaceSlug },
    });

    if (!data.workspace) {
      return {
        notFound: true,
      };
    }
  },
});

export default WorkspacePipelinePage;