import WebappForm from "webapps/features/WebappForm";
import { createGetServerSideProps } from "core/helpers/page";
import {
  WorkspacePageDocument,
  WorkspacePageQuery,
} from "workspaces/graphql/queries.generated";
import Breadcrumbs from "core/components/Breadcrumbs";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import Page from "core/components/Page";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const WebappCreatePage = ({ workspace }: any) => {
  const { t } = useTranslation();
  const router = useRouter();

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
                href={`/workspaces/${encodeURIComponent(
                  workspace.slug,
                )}/webapps`}
              >
                {t("Web Apps")}
              </Breadcrumbs.Part>
              <Breadcrumbs.Part
                href={`/workspaces/${encodeURIComponent(
                  workspace.slug,
                )}/create`}
                isLast
              >
                {t("Create")}
              </Breadcrumbs.Part>
            </Breadcrumbs>
          </>
        }
      >
        <WorkspaceLayout.PageContent>
          <WebappForm workspace={workspace} />
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
    </Page>
  );
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    const { data } = await client.query<WorkspacePageQuery>({
      query: WorkspacePageDocument,
      variables: {
        slug: ctx.params?.workspaceSlug as string,
      },
    });
    return {
      props: {
        workspace: data.workspace,
      },
    };
  },
});

export default WebappCreatePage;
