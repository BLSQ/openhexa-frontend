import { gql, useQuery } from "@apollo/client";
import clsx from "clsx";
import DataGrid from "core/components/DataGrid/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import { OrderByDirection } from "graphql-types";
import {
  DatabaseTableDataGridQuery,
  DatabaseTableDataGrid_TableFragment,
  DatabaseTableDataGrid_WorkspaceFragment,
} from "./DatabaseTableDataGrid.generated";

type DatabaseTableDataGridProps = {
  table: DatabaseTableDataGrid_TableFragment;
  workspace: DatabaseTableDataGrid_WorkspaceFragment;
  className?: string;
};

const DatabaseTableDataGrid = (props: DatabaseTableDataGridProps) => {
  const { table, workspace, className } = props;
  const { data, refetch } = useQuery<DatabaseTableDataGridQuery>(
    gql`
      query DatabaseTableDataGrid(
        $slug: String!
        $tableName: String!
        $orderBy: String!
        $direction: OrderByDirection!
        $page: Int!
        $perPage: Int
      ) {
        workspace(slug: $slug) {
          database {
            table(name: $tableName) {
              rows(
                orderBy: $orderBy
                direction: $direction
                page: $page
                perPage: $perPage
              ) {
                pageNumber
                hasNextPage
                hasPreviousPage
                items
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        slug: workspace.slug,
        tableName: table.name,
        orderBy: table.columns[0].name,
        direction: OrderByDirection.Asc,
        page: 1,
        perPage: 10,
      },
    }
  );

  return (
    <DataGrid
      data={data?.workspace?.database.table?.rows.items ?? []}
      fixedLayout={false}
      totalItems={table.columns.length}
      className={clsx(className)}
      sortable
      manualSortBy
    >
      {table.columns.map((column) => (
        <TextColumn
          key={column.name}
          className="py-3 font-mono"
          textClassName="bg-gray-50 py-1 px-2"
          name={column.name}
          label={column.name}
          accessor={column.name}
        />
      ))}
    </DataGrid>
  );
};

DatabaseTableDataGrid.fragments = {
  workspace: gql`
    fragment DatabaseTableDataGrid_workspace on Workspace {
      slug
    }
  `,
  table: gql`
    fragment DatabaseTableDataGrid_table on DatabaseTable {
      name
      columns {
        name
        type
      }
    }
  `,
};

export default DatabaseTableDataGrid;
