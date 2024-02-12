import Badge from "core/components/Badge";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import DescriptionList from "core/components/DescriptionList";
import Page from "core/components/Page";
import Time from "core/components/Time";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import PipelineVersionCard from "pipelines/features/PipelineVersionCard";
import PipelineVersionParametersTable from "pipelines/features/PipelineVersionParametersTable";
import {
  WorkspacePipelineVersionsPageDocument,
  WorkspacePipelineVersionsPageQuery,
  WorkspacePipelineVersionsPageQueryVariables,
  useWorkspacePipelineVersionsPageQuery,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type Props = {
  workspaceSlug: string;
  pipelineCode: string;
  page: number;
};
const PipelineVersionsPage: NextPageWithLayout<Props> = ({
  workspaceSlug,
  pipelineCode,
  page,
}) => {
  const { t } = useTranslation();

  const { data } = useWorkspacePipelineVersionsPageQuery({
    variables: {
      workspaceSlug,
      pipelineCode,
      page,
    },
  });

  if (!data?.workspace || !data?.pipeline) {
    return null;
  }
  const { workspace, pipeline } = data;
  return (
    <Page title={t("")}>
      <WorkspaceLayout
        workspace={workspace}
        helpLinks={[
          {
            label: t("About pipelines"),
            href: "https://github.com/BLSQ/openhexa/wiki/User-manual#using-pipelines",
          },
          {
            label: t("Writing OpenHEXA pipelines"),
            href: "https://github.com/BLSQ/openhexa/wiki/Writing-OpenHEXA-pipelines",
          },
        ]}
      >
        <WorkspaceLayout.Header className="flex items-center gap-2">
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
              )}/pipelines`}
            >
              {t("Pipelines")}
            </Breadcrumbs.Part>

            <Breadcrumbs.Part
              href={`/workspaces/${encodeURIComponent(
                workspace.slug,
              )}/pipelines/${encodeURIComponent(pipeline.code)}`}
            >
              {pipeline.name}
            </Breadcrumbs.Part>
            <Breadcrumbs.Part
              isLast
              href={`/workspaces/${encodeURIComponent(
                workspace.slug,
              )}/pipelines/${encodeURIComponent(pipeline.code)}/versions`}
            >
              {t("Versions")}
            </Breadcrumbs.Part>
          </Breadcrumbs>
        </WorkspaceLayout.Header>
        <WorkspaceLayout.PageContent>
          {data.pipeline.versions.items.length === 0 && (
            <div className="text-center text-gray-500">
              <div>{t("This pipeline does not have any version.")}</div>
            </div>
          )}
          {data.pipeline.versions.items.map((version) => (
            <PipelineVersionCard key={version.id} version={version} />
          ))}
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
    </Page>
  );
};

PipelineVersionsPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    await WorkspaceLayout.prefetch(ctx, client);
    const page = parseInt(ctx.query.page as string, 10) || 1;
    const { data } = await client.query<
      WorkspacePipelineVersionsPageQuery,
      WorkspacePipelineVersionsPageQueryVariables
    >({
      query: WorkspacePipelineVersionsPageDocument,
      variables: {
        workspaceSlug: ctx.params!.workspaceSlug as string,
        pipelineCode: ctx.params!.pipelineCode as string,
        page,
      },
    });

    if (!data.workspace || !data.pipeline) {
      return { notFound: true };
    }
    return {
      props: {
        workspaceSlug: ctx.params!.workspaceSlug,
        pipelineCode: ctx.params!.pipelineCode,
        page,
      },
    };
  },
});

export default PipelineVersionsPage;
