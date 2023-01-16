import { gql, useQuery } from "@apollo/client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button from "core/components/Button";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import DateColumn from "core/components/DataGrid/DateColumn";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import useCacheKey from "core/hooks/useCacheKey";
import { capitalize } from "lodash";
import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteWorkspaceMemberDialog from "./DeleteWorkspaceMemberDialog";
import { DeleteWorkspaceMember_WorkspaceMemberFragment } from "./DeleteWorkspaceMemberDialog/DeleteWorkspaceMemberDialog.generated";
import { WorskspaceMembersQuery } from "./WorkspaceMembers.generated";

const DEFAULT_PAGE_SIZE = 5;

export default function WorkspaceMembers({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] =
    useState<DeleteWorkspaceMember_WorkspaceMemberFragment>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { data, refetch } = useQuery<WorskspaceMembersQuery>(
    gql`
      query WorskspaceMembers($id: String!, $page: Int, $perPage: Int) {
        workspace(id: $id) {
          members(page: $page, perPage: $perPage) {
            totalItems
            items {
              id
              role
              user {
                id
                displayName
                email
              }
              createdAt
            }
          }
        }
      }
    `,
    { variables: { id: workspaceId, page: 1, perPage: DEFAULT_PAGE_SIZE } }
  );

  useCacheKey("workspace", () => refetch());

  const onChangePage = ({ page }: { page: number }) => {
    refetch({
      page,
      id: workspaceId,
    });
  };

  if (!data?.workspace) {
    return null;
  }

  const { workspace } = data;

  const handleDeleteClicked = (memberId: string) => {
    const member = workspace.members.items.filter((m) => m.id === memberId)[0];
    setSelectedMember(member);
    setOpenDeleteDialog(true);
  };

  return (
    <>
      <DataGrid
        className="bg-white shadow-md"
        defaultPageSize={DEFAULT_PAGE_SIZE}
        totalItems={workspace.members.totalItems}
        fixedLayout={false}
        data={workspace.members.items}
        fetchData={onChangePage}
      >
        <TextColumn
          className="max-w-[50ch] py-3 "
          accessor={({ user }) => user.displayName}
          id="name"
          label={t("Name")}
          defaultValue="-"
        />
        <TextColumn
          className="max-w-[50ch] py-3 "
          accessor={({ user }) => user.email}
          id="email"
          label={t("Email")}
        />
        <TextColumn
          className="max-w-[50ch] py-3 "
          accessor={(member) => capitalize(member.role)}
          label={t("Role")}
          id="member_role"
        />
        <DateColumn
          className="max-w-[50ch] py-3 "
          accessor="createdAt"
          id="createdAt"
          label={t("Joined")}
          format={DateTime.DATE_FULL}
        />
        <BaseColumn className="flex gap-x-4">
          {(member) => (
            <>
              <Button size="sm" variant="secondary">
                <PencilIcon className="h-4" />
              </Button>
              <Button
                onClick={() => handleDeleteClicked(member.id)}
                size="sm"
                variant="secondary"
              >
                <TrashIcon className="h-4" />
              </Button>
            </>
          )}
        </BaseColumn>
      </DataGrid>
      {selectedMember && (
        <DeleteWorkspaceMemberDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          member={selectedMember}
        />
      )}
    </>
  );
}
