import Block from "core/components/Block";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import ChevronLinkColumn from "core/components/DataGrid/ChevronLinkColumn";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Page from "core/components/Page";
import Link from "core/components/Link";
import { createGetServerSideProps } from "core/helpers/page";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Button from "core/components/Button";
import {
  useWebappsPageQuery,
  WebappsPageDocument,
  WebappsPageQuery,
  WebappsPageQueryVariables,
} from "webapps/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import Breadcrumbs from "core/components/Breadcrumbs";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreatePipelineDialog from "workspaces/features/CreatePipelineDialog";

type Props = {
  page: number;
  perPage: number;
};

const WebappsPage = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { data } = useWebappsPageQuery({
    variables: {
      workspaceSlug: router.query.workspaceSlug as string,
      page: props.page,
      perPage: props.perPage,
    },
  });

  const onChangePage = ({ page }: { page: number }) => {
    router.push({ pathname: router.pathname, query: { page } });
  };

  const items = useMemo(() => {
    return data?.webapps.items ?? [];
  }, [data]);

  if (!data?.workspace) {
    return null;
  }

  const { workspace } = data;

  return (
    <Page title={t("Web Apps")}>
      <WorkspaceLayout
        workspace={workspace}
        helpLinks={[
          {
            label: t("About webapps"),
            href: "https://github.com/BLSQ/openhexa/wiki/User-manual#using-webapps",
          },
        ]}
        header={
          <>
            <Breadcrumbs withHome={false} className="flex-1">
              <Breadcrumbs.Part
                isFirst
                href={`/workspaces/${encodeURIComponent(workspace.slug)}`}
              >
                {workspace.name}
              </Breadcrumbs.Part>
              <Breadcrumbs.Part
                isLast
                href={`/workspaces/${encodeURIComponent(
                  workspace.slug,
                )}/webapps`}
              >
                {t("Web Apps")}
              </Breadcrumbs.Part>
            </Breadcrumbs>
            <Button
              leadingIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setDialogOpen(true)}
            >
              {t("Create")}
            </Button>
          </>
        }
      >
        <WorkspaceLayout.PageContent>
          <Block>
            <DataGrid
              defaultPageSize={props.perPage}
              data={items}
              totalItems={data.webapps.totalItems}
              fetchData={onChangePage}
            >
              <BaseColumn id="name" label={t("Name")} minWidth={240}>
                {(item) => (
                  <Link
                    customStyle="text-gray-700 font-medium"
                    href={{
                      pathname: "/webapps/[webappId]",
                      query: { webappId: item.id },
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </BaseColumn>
              <TextColumn label={t("Description")} accessor="description" />
              <TextColumn label={t("URL")} accessor="url" />
              <ChevronLinkColumn
                maxWidth="100"
                accessor="id"
                url={(value: any) => ({
                  pathname: "/webapps/[webappId]",
                  query: { webappId: value },
                })}
              />
            </DataGrid>
          </Block>
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
      <CreatePipelineDialog
        workspace={workspace}
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Page>
  );
};

// TODO : rename graphql query with Workspace
// TODO : query to get one by id
// TODO : update/delete page
// TODO : create page
// TODO : finish list
// TODO : unit test
// TODO : review index.tsx

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    const page = (ctx.query.page as string)
      ? parseInt(ctx.query.page as string, 10)
      : 1;
    const perPage = 15;

    await client.query<WebappsPageQuery, WebappsPageQueryVariables>({
      query: WebappsPageDocument,
      variables: {
        workspaceSlug: ctx.query.workspaceSlug as string,
        page,
        perPage,
      },
    });
    return {
      props: {
        page,
        perPage,
      },
    };
  },
});

export default WebappsPage;
