import { gql, useQuery } from "@apollo/client";
import DataGrid from "core/components/DataGrid/DataGrid";

import { TextColumn } from "core/components/DataGrid/TextColumn";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import {
  DatasetFileDataGrid_FileFragment,
  DatasetFilesDataGridQuery,
  DatasetFilesDataGridQueryVariables,
} from "./DatasetFileDataGrid.generated";

type DatasetFilesDataGridProps = {
  file: DatasetFileDataGrid_FileFragment;
};

const DatasetFilesDataGrid = (props: DatasetFilesDataGridProps) => {
  const { file } = props;
  const { t } = useTranslation();

  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const { data } = useQuery<
    DatasetFilesDataGridQuery,
    DatasetFilesDataGridQueryVariables
  >(
    gql`
      query DatasetFilesDataGrid($id: ID!) {
        datasetVersionFile(id: $id) {
          id
          fileMetadata {
            sample
            status
          }
        }
      }
    `,
    { variables: { id: file.id } },
  );
  const fileMetadata = data?.datasetVersionFile?.fileMetadata;

  const sample = useMemo(() => {
    if (fileMetadata?.sample) {
      try {
        const parsedData = JSON.parse(fileMetadata.sample);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const columns = Object.keys(parsedData[0]);
          setDisplayColumns(columns);
          return parsedData;
        }
      } catch (error) {
        console.error("Error parsing sample data:", error);
      }
    }
    return [];
  }, [fileMetadata]);

  return (
    <div>
      {sample && sample?.length > 0 ? (
        <DataGrid
          data={sample ?? []}
          defaultPageSize={10}
          fixedLayout={false}
          totalItems={sample.length}
        >
          {displayColumns.map((column, id) => (
            <TextColumn
              key={id}
              name={column}
              label={column}
              accessor={column}
            />
          ))}
        </DataGrid>
      ) : (
        <p className="text-center text-gray-500">
          {t("Sample data not available.")}
        </p>
      )}
    </div>
  );
};

DatasetFilesDataGrid.fragments = {
  version: gql`
    fragment DatasetFileDataGrid_file on DatasetVersionFile {
      id
    }
  `,
};

export default DatasetFilesDataGrid;
