import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import {
  DatasetFilesExplorerQuery,
  DatasetFilesExplorerQueryVariables,
} from "./DatasetFilesExplorer.generated";
import { DatasetFileSample, DatasetVersion } from "graphql/types";
import Block from "core/components/Block";
import { useState } from "react";

export type DatasetFileType = {
  id: string;
  filename: string;
  metatada?: DatasetFileSample;
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
    { variables: { versionId: version.id, perPage: 2 } },
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
    <Block className="shadow-none space-y-4 h-96 overflow-y-scroll">
      <Block.Header>
        <span className="text-gray-500">{t("Filename")}</span>
      </Block.Header>
      <Block.Content className="flex flex-col divide-y divide-gray-200 ">
        {files?.items.map((file: DatasetFileType) => (
          <div
            className="py-2.5 hover:bg-gray-100 cursor-pointer"
            key={file.id}
            onClick={() => onClick(file)}
          >
            <span className="text-sm text-gray-500">{file.filename}</span>
          </div>
        ))}
        {files.items.length !== files.totalItems && (
          <div className="pb-2 text-center">
            <button
              onClick={() => showMore()}
              className="ml-4 inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400"
            >
              {t("Show more")}
            </button>
          </div>
        )}
      </Block.Content>
    </Block>
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
