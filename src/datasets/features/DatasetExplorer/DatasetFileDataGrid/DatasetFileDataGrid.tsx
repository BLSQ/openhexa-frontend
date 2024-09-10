import { gql, useQuery } from "@apollo/client";
import DataGrid from "core/components/DataGrid/DataGrid";

import { TextColumn } from "core/components/DataGrid/TextColumn";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import {
  DatasetFileDataGrid_FileFragment,
  DatasetFileDataGridQuery,
  DatasetFileDataGridQueryVariables,
} from "./DatasetFileDataGrid.generated";

type DatasetFileDataGridProps = {
  file: DatasetFileDataGrid_FileFragment;
};

const DatasetFileDataGrid = (props: DatasetFileDataGridProps) => {
  const { file } = props;
  const { t } = useTranslation();

  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const { data } = useQuery<
    DatasetFileDataGridQuery,
    DatasetFileDataGridQueryVariables
  >(
    gql`
      query DatasetFileDataGrid($id: ID!) {
        datasetVersionFile(id: $id) {
          id
          fileSample {
            sample
          }
        }
      }
    `,
    { variables: { id: file.id } },
  );

  const fileSample = data?.datasetVersionFile?.fileSample;

  const sample = useMemo(() => {
    if (fileSample?.sample) {
      try {
        const parsedData = JSON.parse(fileSample.sample);
        if (Array.isArray(parsedData)) {
          const columns = Object.keys(parsedData[0]);
          setDisplayColumns(columns);
          return parsedData;
        }
      } catch (error) {
        console.log("Error parsing sample data:", error);
      }
    }
    return [];
  }, [fileSample]);

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

DatasetFileDataGrid.fragments = {
  version: gql`
    fragment DatasetFileDataGrid_file on DatasetVersionFile {
      id
    }
  `,
};

export default DatasetFileDataGrid;
