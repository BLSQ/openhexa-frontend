import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import {
  DatasetFilesExplorerQuery,
  DatasetFilesExplorerQueryVariables,
} from "./DatasetFilesExplorer.generated";
import { DatasetVersion } from "graphql/types";
import Title from "core/components/Title";

export type DatasetFileType = {
  id: string;
  filename: string;
};

type DatasetFilesExplorerProps = {
  version: Pick<DatasetVersion, "id">;
  onClick: (file: DatasetFileType) => void;
};

const DatasetFilesExplorer = (props: DatasetFilesExplorerProps) => {
  const { t } = useTranslation();
  const { version, onClick } = props;

  const { data, refetch } = useQuery<
    DatasetFilesExplorerQuery,
    DatasetFilesExplorerQueryVariables
  >(
    gql`
      query DatasetFilesExplorer(
        $versionId: ID!
        $page: Int = 1
        $perPage: Int = 15
      ) {
        datasetVersion(id: $versionId) {
          id
          files(page: $page, perPage: $perPage) {
            items {
              id
              filename
              contentType
              createdAt
            }
            totalPages
            totalItems
            pageNumber
          }
        }
      }
    `,
    { variables: { versionId: version.id, perPage: 10 } },
  );

  const files = data?.datasetVersion?.files;
  const showMore = () => {
    refetch({
      page: 1,
      perPage: files?.totalItems,
    });
  };

  if (!files) {
    return null;
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200 ">
      {files?.items.map((file: DatasetFileType) => (
        <div
          className="py-2.5 hover:bg-gray-100 cursor-pointer"
          key={file.id}
          onClick={() => onClick(file)}
        >
          <span className="text-sm text-gray-700">{file.filename}</span>
        </div>
      ))}
      {files.items.length !== files.totalItems && (
        <div className="pb-2 text-center">
          <button
            onClick={showMore}
            className="ml-4 inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400"
          >
            {t("Show more")}
          </button>
        </div>
      )}
    </div>
  );
};

DatasetFilesExplorer.fragments = {
  version: gql`
    fragment DatasetFilesExplorer_version on DatasetVersion {
      id
    }
  `,
};

export default DatasetFilesExplorer;
