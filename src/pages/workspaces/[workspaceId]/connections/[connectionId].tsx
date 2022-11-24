import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import CodeEditor from "core/components/CodeEditor";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Input from "core/components/forms/Input";
import Page from "core/components/Page";
import Tabs from "core/components/Tabs";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { PipelineDataCardStatus } from "workspace/features/PipelineDataCard/PipelineDataCard";
import { WORKSPACES } from "workspace/helpers/fixtures";
import WorkspaceLayout from "workspace/layouts/WorkspaceLayout";

type Props = {
  page: number;
  perPage: number;
};

const WorkspacePipelinePage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const workspace = WORKSPACES.find((w) => w.id === router.query.workspaceId);

  if (!workspace) {
    return null;
  }

  const connection = workspace.connections.find(
    (c) => c.id === router.query.connectionId
  );
  if (!connection) {
    return null;
  }

  return (
    <Page title={t("Workspace")}>
      <WorkspaceLayout.Header>
        <Breadcrumbs withHome={false}>
          <Breadcrumbs.Part
            isFirst
            href={`/workspaces/${encodeURIComponent(workspace.id)}`}
          >
            {workspace.name}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            href={`/workspaces/${encodeURIComponent(workspace.id)}/connections`}
          >
            {t("Pipelines")}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            href={`/workspaces/${encodeURIComponent(
              workspace.id
            )}/pipelines/${encodeURIComponent(connection.id)}`}
          >
            {connection.name}
          </Breadcrumbs.Part>
        </Breadcrumbs>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <Block className="mt-5 p-4">
          <div>
            <div
              className="text-sm font-medium text-gray-900"
              title={connection.name}
            >
              {connection.name}
            </div>
            <div className="text-sm text-gray-700">
              <span>{connection.type}</span>
            </div>
            <div className="h-10 text-sm italic text-gray-600">
              <span>
                {t("This Data source is owned by ")}
                {connection.owner}
              </span>
            </div>
          </div>
          <Tabs defaultIndex={0}>
            <Tabs.Tab className="mt-4" label={t("Information")}>
              <div>
                <Title level={5}>{t("Usage")}</Title>
                <p>{connection.description}</p>
              </div>
            </Tabs.Tab>
            <Tabs.Tab className="mt-4 " label={t("Code samples")}>
              <div className="mt-5">
                <CodeEditor
                  readonly
                  lang="json"
                  value={workspace.database.workspaceTables[0].codeSample[0]}
                />
              </div>
            </Tabs.Tab>
            <Tabs.Tab className="mt-4" label={t("Credentials")}>
              <div className="mt-5">
                <p>Creds 1 : Value 1</p>
                <p>Creds 2 : Value 2</p>
              </div>
            </Tabs.Tab>
          </Tabs>
        </Block>
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

WorkspacePipelinePage.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default WorkspacePipelinePage;
