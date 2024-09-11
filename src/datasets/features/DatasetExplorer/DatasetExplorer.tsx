import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import DatasetFilesExplorer from "./DatasetFilesExplorer";
import { DatasetFileType } from "./DatasetFilesExplorer/DatasetFilesExplorer";
import { DatasetVersion, DatasetVersionFile } from "graphql/types";
import DatasetFileSummary from "./DatasetFileSummary";
import Tabs from "core/components/Tabs";
import DatasetFileDataGrid from "./DatasetFileDataGrid";
import Block from "core/components/Block";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { DatasetExplorerFile_FileFragment } from "./DatasetExplorer.generated";

type DatasetExplorerProps = {
  version: Pick<DatasetVersion, "id"> | null;
  currentFile?: DatasetExplorerFile_FileFragment | null;
};

const DatasetExplorer = ({ version, currentFile }: DatasetExplorerProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const onFileSelected = (file: DatasetFileType) => {
    router.push({
      pathname: `${router.pathname}`,
      query: { ...router.query, version: version?.id, fileId: file.id },
    });
  };

  if (!version) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <DatasetFilesExplorer version={version} onClick={onFileSelected} />
      <div className="col-span-3 py-2 space-y-4">
        {currentFile ? (
          <>
            <DatasetFileSummary file={currentFile} />
            <Block className="py-2 px-4 space-y-8">
              <Tabs>
                <Tabs.Tab label={t("Sample")} className="h-full">
                  <DatasetFileDataGrid file={currentFile} />
                </Tabs.Tab>
              </Tabs>
            </Block>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <MagnifyingGlassIcon className="w-8 h-8 mb-2" />
            <p>
              {t("Please select a file to view its sample data and metadata.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

DatasetExplorer.fragments = {
  file: gql`
    fragment DatasetExplorerFile_file on DatasetVersionFile {
      id
      filename
      ...DatasetFileSummary_file
      ...DatasetFileDataGrid_file
    }
    ${DatasetFileSummary.fragments.file}
  `,
  version: gql`
    fragment DatasetExplorerVersion on DatasetVersion {
      id
      ...DatasetFilesExplorer_version
    }
    ${DatasetFilesExplorer.fragments.version}
  `,
};

export default DatasetExplorer;
