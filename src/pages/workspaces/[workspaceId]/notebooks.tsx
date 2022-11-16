import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useNotebooksPageQuery } from "notebooks/graphql/queries.generated";
import { WORKSPACES } from "workspaces/helpers/fixtures";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type Props = {
  page: number;
  perPage: number;
};

const WorkspaceNotebooksPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useNotebooksPageQuery();

  if (!data) {
    return null;
  }

  return (
    <Page title={t("Workspace")}>
      <WorkspaceLayout.Header></WorkspaceLayout.Header>
      <iframe className="h-full w-full flex-1" src={data.notebooksUrl}></iframe>
    </Page>
  );
};

WorkspaceNotebooksPage.getLayout = (page, pageProps) => {
  return (
    <WorkspaceLayout mainClassName="min-h-screen" pageProps={pageProps}>
      {page}
    </WorkspaceLayout>
  );
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default WorkspaceNotebooksPage;
