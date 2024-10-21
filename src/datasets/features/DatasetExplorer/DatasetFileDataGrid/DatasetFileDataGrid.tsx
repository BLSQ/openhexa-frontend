import { gql, useQuery } from "@apollo/client";
import DataGrid from "core/components/DataGrid/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import { useTranslation } from "next-i18next";
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

  if (loading)
    return (
      <div className="flex justify-center">
        <Spinner size="md" />
      </div>
    );

  if (!fileSample || fileSample.status === FileSampleStatus.Failed)
    return (
      <p className="text-center text-gray-500">
        {t("Sample data not available.")}
      </p>
    );

  if (fileSample.status === FileSampleStatus.Processing)
    return (
      <p className="text-center text-gray-500">
        {t(
          "We're working on generating your data sample. Please refresh the page periodically.",
        )}
      </p>
    );

  return (
    <DataGrid
      data={fileSample.sample || []}
      defaultPageSize={10}
      totalItems={fileSample.sample?.length}
    >
      {columns.map((col, id) => (
        <TextColumn key={id} name={col} label={col} accessor={col} />
      ))}
    </DataGrid>
  );
};

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
