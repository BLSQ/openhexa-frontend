import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import ConnectionDataCard from "workspace/features/ConnectionDataCard";
import CreateConnectionDialog from "workspace/features/CreateConnectionDialog";
import { WORKSPACES } from "workspace/helpers/fixtures";
import WorkspaceLayout from "workspace/layouts/WorkspaceLayout";

type Props = {
  page: number;
  perPage: number;
};

const WorkspaceConnectionsPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const workspace = WORKSPACES.find((w) => w.id === router.query.workspaceId);
  const [openModal, setOpenModal] = useState(false);

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
          <Breadcrumbs.Part
            href={`/workspaces/${encodeURIComponent(workspace.id)}/Connections`}
          >
            {t("Connections")}
          </Breadcrumbs.Part>
        </Breadcrumbs>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <div className="grid grid-cols-3 gap-5 sm:grid-cols-3">
          <div className="col-start-1 col-end-4 flex justify-end">
            <div>
              <Button onClick={() => setOpenModal(true)}>
                {t("Add connection")}
              </Button>
            </div>
          </div>
          {workspace.connections.map((connection, index) => (
            <div key={index} className="col-start-1 col-end-4">
              <ConnectionDataCard connection={connection} />
            </div>
          ))}
        </div>
        <CreateConnectionDialog
          open={openModal}
          onClose={() => setOpenModal(!openModal)}
        />
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

WorkspaceConnectionsPage.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default WorkspaceConnectionsPage;
