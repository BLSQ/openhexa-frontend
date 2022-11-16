import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Page from "core/components/Page";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { WORKSPACES } from "workspace/helpers/fixtures";
import WorkspaceLayout from "workspace/layouts/WorkspaceLayout";

type Props = {
  page: number;
  perPage: number;
};

const WorkspaceHome: NextPageWithLayout = (props: Props) => {
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
        </Breadcrumbs>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <ReactMarkdown className="prose-xl text-sm">
          {workspace.description}
        </ReactMarkdown>
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

WorkspaceHome.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default WorkspaceHome;
