import Block from "core/components/Block";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import ChevronLinkColumn from "core/components/DataGrid/ChevronLinkColumn";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Page from "core/components/Page";
import Link from "core/components/Link";
import { createGetServerSideProps } from "core/helpers/page";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import BackLayout from "core/layouts/back/BackLayout";
import Button from "core/components/Button";
import {
  useWebappsPageQuery,
  WebappsPageDocument,
  WebappsPageQuery,
  WebappsPageQueryVariables,
} from "webapps/graphql/queries.generated";

type Props = {
  page: number;
  perPage: number;
};

const WebappsPage = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
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

  if (!data) {
    return null;
  }

  return (
    <Page title={t("Web Apps")}>
      <BackLayout
        title={
          <div className="flex gap-2">
            <Button onClick={() => router.push("/webapps")} size="sm">
              {t("Web Apps")}
            </Button>
          </div>
        }
      >
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
      </BackLayout>
    </Page>
  );
};

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
