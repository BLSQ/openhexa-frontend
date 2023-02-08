import { gql, useQuery } from "@apollo/client";
import Button from "core/components/Button";
import DataGrid from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Dialog from "core/components/Dialog";
import { TableColumn, TableValue } from "graphql-types";
import { useTranslation } from "next-i18next";
import { WorkspaceDatabaseTableDataQuery } from "./DataPreviewDialog.generated";

const DataPreviewDialog = ({
  open,
  workspaceId,
  tableName,
  onClose,
}: {
  open: boolean;
  workspaceId: string;
  tableName: string;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { data } = useQuery<WorkspaceDatabaseTableDataQuery>(
    gql`
      query WorkspaceDatabaseTableData(
        $workspaceSlug: String!
        $tableName: String!
      ) {
        workspace(slug: $workspaceSlug) {
          database {
            table(name: $tableName) {
              columns {
                name
                type
              }
              sample {
                column
                value
              }
            }
          }
        }
      }
    `,
    { variables: { workspaceSlug: workspaceId, tableName: tableName } }
  );

  if (!data?.workspace) {
    return null;
  }
  const { workspace } = data;
  const { table } = workspace.database;
  if (!table) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-6xl" centered={false}>
      <Dialog.Title>
        {t("Sample data for {{name}}", { name: tableName })}
      </Dialog.Title>
      <Dialog.Content>
        <div>
          <p className="text-gray-600">
            {t(
              "The following table gives you a preview of data available on {{name}}",
              { name: tableName }
            )}
          </p>
          <DataGrid
            data={table.sample}
            fixedLayout={false}
            className="mt-4"
            defaultPageSize={5}
          >
            {table.columns.map((c: TableColumn, index) => (
              <TextColumn
                key={index}
                className="py-3 font-medium"
                name={c.name}
                label={c.name}
                accessor={(row: [TableValue]) =>
                  row.filter((r) => r.column === c.name)[0].value
                }
                defaultValue="-"
              />
            ))}
          </DataGrid>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={onClose}>{t("Close")}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DataPreviewDialog;
