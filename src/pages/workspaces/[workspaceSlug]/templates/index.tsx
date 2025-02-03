import Breadcrumbs from "core/components/Breadcrumbs";
import Page from "core/components/Page";
import Pagination from "core/components/Pagination";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import {
  useWorkspaceTemplatesPageQuery,
  WorkspaceTemplatesPageDocument,
  WorkspaceTemplatesPageQuery,
  WorkspaceTemplatesPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import { useRouter } from "next/router";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import TemplateCard from "workspaces/features/TemplateCard";

type Props = {
  page: number;
  perPage: number;
  workspaceSlug: string;
};

const WorkspaceTemplatesPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const { page, perPage, workspaceSlug } = props;

  const router = useRouter();
  const { data } = useWorkspaceTemplatesPageQuery({
    variables: {
      workspaceSlug,
      page,
      perPage,
    },
  });

  if (!data?.workspace) {
    return null;
  }

  const { workspace, pipelineTemplates } = data;

  return (
    <Page title={workspace.name}>
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
                isLast
                href={`/workspaces/${encodeURIComponent(
                  workspace.slug,
                )}/templates`}
              >
                {t("Templates")}
              </Breadcrumbs.Part>
            </Breadcrumbs>
          </>
        }
      >
        <WorkspaceLayout.PageContent className="divide divide-y-2">
          {pipelineTemplates.items.length === 0 ? (
            <div className="text-center text-gray-500">
              <div>{t("No template to show")}</div>
            </div>
          ) : (
            <>
              <div className="mt-5 mb-3 grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-5">
                {pipelineTemplates.items.map((template, index) => (
                  <TemplateCard
                    workspace={workspace}
                    key={index}
                    template={template}
                  />
                ))}
              </div>
              <Pagination
                onChange={(page, perPage) =>
                  router.push({
                    pathname: "/workspaces/[workspaceSlug]/templates",
                    query: {
                      page,
                      perPage,
                      workspaceSlug,
                    },
                  })
                }
                page={page}
                perPage={perPage}
                totalItems={pipelineTemplates.totalItems}
                countItems={pipelineTemplates.items.length}
              />
            </>
          )}
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
    </Page>
  );
};

WorkspaceTemplatesPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const { workspaceSlug } = ctx.params!;
    const page = parseInt((ctx.query.page as string) ?? "1", 10);
    const perPage = parseInt((ctx.query.perPage as string) ?? "15", 10);

    await WorkspaceLayout.prefetch(ctx, client);
    const { data } = await client.query<
      WorkspaceTemplatesPageQuery,
      WorkspaceTemplatesPageQueryVariables
    >({
      query: WorkspaceTemplatesPageDocument,
      variables: {
        workspaceSlug: workspaceSlug as string,
        page,
        perPage,
      },
    });
    if (!data.workspace) {
      return { notFound: true };
    }
    return {
      props: {
        workspaceSlug,
        page,
        perPage,
      },
    };
  },
});

export default WorkspaceTemplatesPage;
