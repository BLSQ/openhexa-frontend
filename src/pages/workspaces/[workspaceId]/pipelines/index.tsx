import {
  MagnifyingGlassIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import DateColumn from "core/components/DataGrid/DateColumn";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Link from "core/components/Link";
import Page from "core/components/Page";
import Tabs from "core/components/Tabs";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PipelineDataCard from "pipelines/features/PipelineDataCard/PipelineDataCard";
import { WORKSPACES } from "workspace/helpers/fixtures";
import WorkspaceLayout from "workspace/layouts/WorkspaceLayout";

type Props = {
  page: number;
  perPage: number;
};

const PipelinesPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const workspace = WORKSPACES.find((w) => w.id === router.query.workspaceId);

  if (!workspace) {
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
            href={`/workspaces/${encodeURIComponent(workspace.id)}/pipelines`}
          >
            {t("Pipelines")}
          </Breadcrumbs.Part>
        </Breadcrumbs>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <div>
          <Tabs defaultIndex={0}>
            <Tabs.Tab
              className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3"
              label={t("All pipelines")}
            >
              {workspace.dags.map((dag, index) => (
                <PipelineDataCard key={index} dag={dag} />
              ))}
            </Tabs.Tab>
          </Tabs>
        </div>

        <div></div>
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

PipelinesPage.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default PipelinesPage;
