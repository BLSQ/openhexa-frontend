import Button from "core/components/Button";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import DateColumn from "core/components/DataGrid/DateColumn";
import { TextColumn } from "core/components/DataGrid/TextColumn";

import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { useWorkspacePageQuery } from "workspaces/graphql/queries.generated";

export default function WorkspaceMembers({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { t } = useTranslation();
  const { data, refetch } = useWorkspacePageQuery({
    variables: { id: workspaceId, page: 1, perPage: 5 },
  });

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
    <DataGrid
      className="bg-white shadow-md"
      defaultPageSize={10}
      totalItems={workspace.members.totalItems}
      fixedLayout={false}
      data={workspace.members.items}
      fetchData={onChangePage}
    >
      <TextColumn
        className="max-w-[50ch] py-3 "
        accessor={({ user }) => user.displayName}
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
  );
}
