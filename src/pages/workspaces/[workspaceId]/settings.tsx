import Breadcrumbs from "core/components/Breadcrumbs";
import Page from "core/components/Page";
import Title from "core/components/Title";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";

import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import Tabs from "core/components/Tabs";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Button from "core/components/Button";
import DateColumn from "core/components/DataGrid/DateColumn";
import { DateTime } from "luxon";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import Block from "core/components/Block";
import {
  useWorkspacePageQuery,
  WorkspacePageDocument,
  WorkspacePageQuery,
} from "workspaces/graphql/queries.generated";
import DataCard from "core/components/DataCard";
import TextProperty from "core/components/DataCard/TextProperty";
import { OnSaveFn } from "core/components/DataCard/FormSection";
import { useUpdateWorkspaceMutation } from "workspaces/graphql/mutations.generated";
import DescriptionList from "core/components/DescriptionList";
import { useState } from "react";
import DeleteWorkspaceDialog from "workspaces/features/DeleteWorkspaceDialog";
import InviteMemberDialog from "workspaces/features/InviteMemberDialog";

type Props = {
  page: number;
  perPage: number;
  workspaceId: string;
};

const WorkspaceSettingsPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const { data, refetch } = useWorkspacePageQuery({
    variables: { id: props.workspaceId, page: 1, perPage: 5 },
  });

  const [mutate] = useUpdateWorkspaceMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);

  const onSectionSave: OnSaveFn = async (values) => {
    await mutate({
      variables: {
        input: {
          id: workspace.id,
          name: values.name,
        },
      },
    });
    await refetch();
  };

  const onChangePage = ({ page }: { page: number }) => {
    refetch({
      page,
      perPage: 5,
      id: workspace.id as string,
    });
  };

  if (!data?.workspace) {
    return null;
  }

  const { workspace } = data;

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
          <Breadcrumbs.Part isLast>{t("Settings")}</Breadcrumbs.Part>
        </Breadcrumbs>
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent className="space-y-8">
        <DataCard className="w-full" item={workspace}>
          <DataCard.FormSection
            collapsible={false}
            onSave={onSectionSave}
            title={t("General settings")}
          >
            <TextProperty
              required
              id="name"
              accessor="name"
              label={t("Name")}
              defaultValue="-"
            />
            <DescriptionList>
              <DescriptionList.Item label={t("Delete this workspace")}>
                <Button
                  size="sm"
                  className="bg-red-700 hover:bg-red-700 focus:ring-red-500"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  leadingIcon={<TrashIcon className="w-4" />}
                >
                  {t("Delete")}
                </Button>
              </DescriptionList.Item>
            </DescriptionList>
          </DataCard.FormSection>
        </DataCard>

        <Tabs defaultIndex={0}>
          <Tabs.Tab className="mt-4" label={t("Members")}>
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => setIsNewMemberDialogOpen(true)}
                leadingIcon={<PlusCircleIcon className="mr-1 h-4 w-4" />}
              >
                {t("Invite member")}
              </Button>
            </div>
            <Block>
              <DataGrid
                className="bg-white shadow-md"
                defaultPageSize={10}
                totalItems={workspace.memberships.totalItems}
                fixedLayout={false}
                data={workspace.memberships.items}
                fetchData={onChangePage}
              >
                <TextColumn
                  className="max-w-[50ch] py-3 "
                  accessor={({ user }) =>
                    user.firstName ? `${user.firstName} ${user.lastName}` : "-"
                  }
                  id="name"
                  label="Name"
                  defaultValue="-"
                />
                <TextColumn
                  className="max-w-[50ch] py-3 "
                  accessor={({ user }) => user.email}
                  id="email"
                  label="Email"
                />
                <TextColumn
                  className="max-w-[50ch] py-3 "
                  accessor="role"
                  label="Role"
                  id="member_role"
                />
                <DateColumn
                  className="max-w-[50ch] py-3 "
                  accessor="createdAt"
                  id="createdAt"
                  label="Joined"
                  format={DateTime.DATE_FULL}
                />
                <BaseColumn>
                  {() => (
                    <Button size="sm" variant="secondary">
                      {t("Edit")}
                    </Button>
                  )}
                </BaseColumn>
              </DataGrid>
            </Block>
          </Tabs.Tab>
          <Tabs.Tab
            className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3"
            label={t("Environments")}
          >
            <div></div>
          </Tabs.Tab>
          <Tabs.Tab
            className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3"
            label={t("Version Control")}
          >
            <div></div>
          </Tabs.Tab>
          <Tabs.Tab
            className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3"
            label={t("Policies")}
          >
            <div></div>
          </Tabs.Tab>
        </Tabs>
        <DeleteWorkspaceDialog
          workspace={workspace}
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
          }}
        />
        <InviteMemberDialog
          open={isNewMemberDialogOpen}
          onClose={() => {
            setIsNewMemberDialogOpen(false);
            refetch({ id: workspace.id, page: 1, perPage: 5 });
          }}
          workspace={workspace}
        />
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

WorkspaceSettingsPage.getLayout = (page, pageProps) => {
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
      },
    };
  },
});

export default WorkspaceSettingsPage;
