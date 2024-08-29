import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import DatasetFilesExplorer from "./DatasetFilesExplorer";
import { DatasetFileType } from "./DatasetFilesExplorer/DatasetFilesExplorer";
import { DatasetVersion } from "graphql/types";
import DatasetFileSummary from "./DatasetFileSummary";
import Tabs from "core/components/Tabs";
import DatasetFilesDataGrid from "./DatasetFileDataGrid";
import Block from "core/components/Block";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type DatasetExplorerProps = {
  version: Pick<DatasetVersion, "id">;
};

const DatasetExplorer = ({ version }: DatasetExplorerProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<DatasetFileType | null>(
    null,
  );

  const onFileSelected = (file: DatasetFileType) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    setSelectedFile(null);
  }, [version]);

  if (!version) {
    return (
      <p className="italic text-gray-500">
        {t(
          "This dataset has no version. Upload a new version using your browser or the SDK to see it here.",
        )}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <DatasetFilesExplorer version={version} onClick={onFileSelected} />
      <div className="col-span-3 py-2 space-y-4">
        {selectedFile ? (
          <>
            <DatasetFileSummary file={selectedFile} />
            <Block className="py-2 px-4 space-y-8">
              <Tabs>
                <Tabs.Tab label={t("Sample")} className="h-full">
                  <DatasetFilesDataGrid file={selectedFile} />
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

export default DatasetExplorer;
