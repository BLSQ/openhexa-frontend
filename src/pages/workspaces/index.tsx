import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import useFeature from "identity/hooks/useFeature";
import useMe from "identity/hooks/useMe";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CreateWorkspaceDialog from "workspaces/features/CreateWorkspaceDialog";
import { useWorkspacesPageQuery } from "workspaces/graphql/queries.generated";

const WorkspacesHome: NextPageWithLayout = () => {
  const { data, loading } = useWorkspacesPageQuery({});
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const [hasWorkspacesEnabled] = useFeature("workspaces");
  const me = useMe();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading) {
      if (data?.workspaces && data.workspaces.items.length) {
        const latestWorkspace = data.workspaces.items[0];
        router.push(`/workspaces/${latestWorkspace.id}`);
      } else if (hasWorkspacesEnabled && me.permissions.createWorkspace) {
        setOpenDialog(true);
      } else {
        router.push("/dashboard");
      }
    }
  }, [data, router, loading, hasWorkspacesEnabled, me]);

  const handleClose = (workspaceId: string | null) => {
    if (!workspaceId) {
      return router.push("/dashboard");
    }
    router.push(`/workspaces/${workspaceId}`);
  };

  return (
    <Page title={t("New workspace")}>
      <CreateWorkspaceDialog open={openDialog} onClose={handleClose} />
    </Page>
  );
};

WorkspacesHome.getLayout = (page: ReactElement) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default WorkspacesHome;
