import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import MarkdownViewer from "core/components/MarkdownViewer";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import EditWorkspaceDialog from "workspaces/features/EditWorkspaceDialog/EditWorkspaceDialog";
import {
  useWorkspacePageQuery,
  WorkspacePageDocument,
  WorkspacePageQuery,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type Props = {
  workspaceId: string;
  page: number;
  perPage: number;
};

const WorkspaceHome: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, refetch } = useWorkspacePageQuery({
    variables: { id: props.workspaceId },
  });

  if (!data?.workspace) {
    return null;
  }

  const { workspace } = data;

  return (
    <Page title={t("Workspace")}>
      <WorkspaceLayout.Header className="flex items-center justify-between">
        <Breadcrumbs withHome={false}>
          <Breadcrumbs.Part
            isFirst
            href={`/workspaces/${encodeURIComponent(workspace.id)}`}
          >
            {workspace.name}
          </Breadcrumbs.Part>
        </Breadcrumbs>
        <Button onClick={() => setIsDialogOpen(true)}>{t("Edit")}</Button>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <Block>
          <Block.Content>
            <MarkdownViewer>{workspace.description || ""}</MarkdownViewer>
          </Block.Content>
        </Block>
      </WorkspaceLayout.PageContent>
      <EditWorkspaceDialog
        open={isDialogOpen}
        workspace={workspace}
        onClose={() => {
          setIsDialogOpen(false);
          refetch();
        }}
      />
    </Page>
  );
};

WorkspaceHome.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const { data } = await client.query<WorkspacePageQuery>({
      query: WorkspacePageDocument,
      variables: {
        id: ctx.params?.workspaceId,
      },
    });

    if (!data.workspace) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        workspaceId: ctx.params?.workspaceId,
        workspace: data.workspace,
      },
    };
  },
});

export default WorkspaceHome;
