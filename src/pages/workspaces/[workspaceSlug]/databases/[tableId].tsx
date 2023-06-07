import { EyeIcon } from "@heroicons/react/24/outline";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import DataGrid from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import DatabaseTableDataGrid from "workspaces/features/DatabaseTableDataGrid/DatabaseTableDataGrid";
import {
  useWorkspaceDatabaseTablePageQuery,
  WorkspaceDatabaseTablePageDocument,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type Props = {
  page: number;
  perPage: number;
};

const WorkspaceDatabaseTableViewPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useWorkspaceDatabaseTablePageQuery({
    variables: {
      workspaceSlug: router.query.workspaceSlug as string,
      tableName: router.query.tableId as string,
    },
  });

  if (!data?.workspace) {
    return null;
  }
  const { workspace } = data;
  const { table } = workspace.database;
  if (!table) {
    return null;
  }

  return (
    <Page title={table.name}>
      <WorkspaceLayout workspace={workspace}>
        <WorkspaceLayout.Header className="flex items-center justify-between">
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
              )}/databases`}
            >
              {t("Database")}
            </Breadcrumbs.Part>
            <Breadcrumbs.Part
              isLast
              href={`/workspaces/${encodeURIComponent(
                workspace.slug
              )}/databases/${router.query.tableId}`}
            >
              {table.name}
            </Breadcrumbs.Part>
          </Breadcrumbs>
          <div className="flex items-center gap-2"></div>
        </WorkspaceLayout.Header>
        <WorkspaceLayout.PageContent className="space-y-4">
          <Block className="divide-y-2 divide-gray-100">
            <Block.Content title={t("Data")}>
              <DatabaseTableDataGrid workspace={workspace} table={table} />
            </Block.Content>
            <Block.Content title={t("Usage")}>Lala</Block.Content>
          </Block>
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
    </Page>
  );
};

WorkspaceDatabaseTableViewPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    await WorkspaceLayout.prefetch(ctx, client);
    const { data } = await client.query({
      query: WorkspaceDatabaseTablePageDocument,
      variables: {
        workspaceSlug: ctx.params?.workspaceSlug,
        tableName: ctx.params?.tableId,
      },
    });

    if (!data.workspace?.database.table) {
      return {
        notFound: true,
      };
    }
  },
});

export default WorkspaceDatabaseTableViewPage;
