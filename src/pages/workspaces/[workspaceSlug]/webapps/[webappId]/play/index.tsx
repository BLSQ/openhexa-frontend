import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import {
  useWorkspaceWebappPageQuery,
  WorkspaceWebappPageDocument,
  WorkspaceWebappPageQuery,
  WorkspaceWebappPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import Breadcrumbs from "core/components/Breadcrumbs";
import { useState } from "react";
import Spinner from "core/components/Spinner";
import clsx from "clsx";

type Props = {
  webappId: string;
  workspaceSlug: string;
};

const WorkspaceWebappPlayPage: NextPageWithLayout = (props: Props) => {
  const { webappId, workspaceSlug } = props;
  const { t } = useTranslation();
  const [iframeLoading, setIframeLoading] = useState(true);

  const { data } = useWorkspaceWebappPageQuery({
    variables: {
      workspaceSlug,
      webappId,
    },
  });

  if (!data?.workspace || !data?.webapp) {
    return null;
  }

  const { workspace, webapp } = data;

  return (
    <Page title={t("Web Apps")}>
      <WorkspaceLayout
        workspace={workspace}
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
                )}/webapps/${encodeURIComponent(webapp.id)}`}
                isLast
              >
                {webapp.name}
              </Breadcrumbs.Part>
            </Breadcrumbs>
          </>
        }
      >
        <WorkspaceLayout.PageContent>
          <div
            className={"flex justify-center items-center"}
            style={{ height: "80vh" }}
          >
            {iframeLoading && <Spinner size="md" />}{" "}
            <iframe
              src={webapp.url}
              className={clsx("w-full h-full", iframeLoading && "hidden")}
              sandbox="allow-forms allow-popups allow-downloads allow-presentation allow-modals allow-scripts"
              onLoad={() => setIframeLoading(false)}
              onError={() => setIframeLoading(false)}
            />
          </div>
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
    </Page>
  );
};

WorkspaceWebappPlayPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    await WorkspaceLayout.prefetch(ctx, client);
    const { data } = await client.query<
      WorkspaceWebappPageQuery,
      WorkspaceWebappPageQueryVariables
    >({
      query: WorkspaceWebappPageDocument,
      variables: {
        workspaceSlug: ctx.params!.workspaceSlug as string,
        webappId: ctx.params!.webappId as string,
      },
    });

    if (!data.workspace || !data.webapp) {
      return { notFound: true };
    }

    return {
      props: {
        workspaceSlug: ctx.params!.workspaceSlug,
        webappId: ctx.params!.webappId,
        workspace: data.workspace,
        webapp: data.webapp,
      },
    };
  },
});

export default WorkspaceWebappPlayPage;
