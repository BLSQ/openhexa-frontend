import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import DataGrid from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import CreateWorkspaceDialog from "workspaces/features/CreateWorkspaceDialog";
import {
  useWorkspacesPageQuery,
  WorkspacesPageDocument,
  WorkspacesPageQuery,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type Props = {
  page?: number;
  perPage?: number;
};

const WorkspacesHomePage: NextPageWithLayout = ({
  page = 1,
  perPage = 15,
}: Props) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  console.log("render");

  const { data, refetch } = useWorkspacesPageQuery({
    variables: { page, perPage },
  });

  const onFetchData = useCallback(
    ({ page, pageSize }: { page: number; pageSize: number }) => {
      router.push({
        pathname: router.pathname,
        query: { page, perPage: pageSize },
      });
    },
    [router]
  );

  if (!data) {
    return null;
  }

  return (
    <Page title={t("New workspace")}>
      <WorkspaceLayout.Header className="flex items-center gap-2">
        <Breadcrumbs withHome={false} className="flex-1">
          <Breadcrumbs.Part isFirst href={"/workspaces"} isLast>
            {t("Workspaces")}
          </Breadcrumbs.Part>
        </Breadcrumbs>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <Block>
          <DataGrid
            fetchData={onFetchData}
            data={data.workspaces.items}
            defaultPageSize={15}
            totalItems={data.workspaces.totalItems}
          >
            <TextColumn accessor="name" label={t("Name")} />
          </DataGrid>
        </Block>
      </WorkspaceLayout.PageContent>
      <CreateWorkspaceDialog open={isOpen} onClose={() => setOpen(false)} />
    </Page>
  );
};

WorkspacesHomePage.getLayout = (page, pageProps) => (
  <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>
);

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const page = ctx.params?.page ?? 1;
    const perPage = ctx.params?.perPage ?? 15;
    console.log("JH");
    await client.query<WorkspacesPageQuery>({
      query: WorkspacesPageDocument,
      variables: { page, perPage },
    });

    return {
      props: { page, perPage },
    };
  },
});

export default WorkspacesHomePage;
