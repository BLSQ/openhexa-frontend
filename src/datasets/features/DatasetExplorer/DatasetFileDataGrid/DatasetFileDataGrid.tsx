import { gql, useQuery } from "@apollo/client";
import DataGrid from "core/components/DataGrid/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import {
  DatasetFileDataGridQuery,
  DatasetFileDataGridQueryVariables,
  DatasetFileDataGrid_FileFragment,
} from "./DatasetFileDataGrid.generated";
import Spinner from "core/components/Spinner";
import { FileSampleStatus } from "graphql/types";

type DatasetFileDataGridProps = {
  file: DatasetFileDataGrid_FileFragment;
  columns: string[];
};

const DatasetFileDataGrid = (props: DatasetFileDataGridProps) => {
  const { t } = useTranslation();
  const { file, columns } = props;

  const { data, loading } = useQuery<
    DatasetFileDataGridQuery,
    DatasetFileDataGridQueryVariables
  >(
    gql`
      query DatasetFileDataGrid($id: ID!) {
        datasetVersionFile(id: $id) {
          id
          fileSample {
            sample
            status
          }
        }
      }
    `,
    { variables: { id: file.id } },
  );
  const fileSample = data?.datasetVersionFile?.fileSample;

  //todo fix the sample format on the back-end to remove this function
  const sample = useMemo(() => {
    if (fileSample?.sample && fileSample.status === FileSampleStatus.Finished) {
      try {
        const parsedData = JSON.parse(fileSample.sample);
        if (Array.isArray(parsedData)) {
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
      {loading && (
        <div className="flex justify-center">
          <Spinner size="md" />
        </div>
      )}
      {!loading && (
        <div>
          {(fileSample?.status == FileSampleStatus.Failed || !fileSample) && (
            <p className="text-center text-gray-500">
              {t("Sample data not available.")}
            </p>
          )}
          {fileSample?.status == FileSampleStatus.Processing && (
            <p className="text-center text-gray-500">
              {t(
                "We're working on generating your data sample.This may take a few moments. Please refresh the page periodically to view the results.",
              )}
            </p>
          )}
          {fileSample?.status == FileSampleStatus.Finished &&
            sample?.length > 0 && (
              <>
                <DataGrid
                  data={sample ?? []}
                  defaultPageSize={10}
                  fixedLayout={false}
                  totalItems={sample.length}
                >
                  {columns.map((column, id) => (
                    <TextColumn
                      key={id}
                      name={column}
                      label={column}
                      accessor={column}
                    />
                  ))}
                </DataGrid>
              </>
            )}
        </div>
      )}
    </div>
  );
};

// todo add a loader, check status for sample
DatasetFileDataGrid.fragments = {
  file: gql`
    fragment DatasetFileDataGrid_file on DatasetVersionFile {
      id
      fileSample {
        sample
        status
      }
    }
  `,
};

export default DatasetFileDataGrid;
