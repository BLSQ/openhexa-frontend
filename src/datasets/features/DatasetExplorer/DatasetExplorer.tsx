import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import DatasetFilesExplorer from "./DatasetFilesExplorer";
import { DatasetFileType } from "./DatasetFilesExplorer/DatasetFilesExplorer";
import { FileSampleStatus } from "graphql/types";
import DatasetFileSummary from "./DatasetFileSummary";
import Tabs from "core/components/Tabs";
import DatasetFileDataGrid from "./DatasetFileDataGrid";
import Block from "core/components/Block";
import {
  MagnifyingGlassIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import Button from "core/components/Button";
import Popover from "core/components/Popover";
import Checkbox from "core/components/forms/Checkbox";
import DownloadVersionFile from "../DownloadVersionFile";
import {
  DatasetExplorerDatasetVersion_VersionFragment,
  DatasetExplorerFile_FileFragment,
} from "./DatasetExplorer.generated";

type DatasetExplorerProps = {
  version: DatasetExplorerDatasetVersion_VersionFragment;
  currentFile?: DatasetExplorerFile_FileFragment | null;
};

const DatasetExplorer = ({ version, currentFile }: DatasetExplorerProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);

  //todo fix the sample format on the back-end to remove this function
  const columns = useMemo(() => {
    if (
      currentFile?.fileSample &&
      currentFile.fileSample.status === FileSampleStatus.Finished
    ) {
      const {
        fileSample: { sample },
      } = currentFile;
      const cols = Object.keys(sample[0]);
      setDisplayColumns(cols);
      return cols;
    }
    return [];
  }, [currentFile]);

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
            <Block className="py-2 px-4 space-y-2">
              <Tabs>
                <Tabs.Tab label={t("Sample")} className="space-y-2 pt-2">
                  <div className="space-y-2">
                    {currentFile.fileSample && (
                      <div className="flex flex justify-end">
                        <Popover
                          placement="bottom-start"
                          withPortal
                          as="div"
                          trigger={
                            <Button
                              leadingIcon={
                                <ViewColumnsIcon className="h-4 w-4" />
                              }
                              size="sm"
                            >
                              {t("Select columns")}
                            </Button>
                          }
                        >
                          <p className="mb-2 text-sm">
                            {t("Select the columns to display in the grid")}
                          </p>
                          <div className="max-h-96 overflow-y-auto pb-2 ">
                            {columns.map((column) => (
                              <div
                                key={column}
                                className="flex items-center py-1.5"
                              >
                                <Checkbox
                                  name={column}
                                  label={column}
                                  checked={displayColumns.some(
                                    (c) => c === column,
                                  )}
                                  onChange={(event) =>
                                    event.target.checked
                                      ? setDisplayColumns([
                                          ...displayColumns,
                                          column,
                                        ])
                                      : setDisplayColumns(
                                          displayColumns.filter(
                                            (c) => c !== column,
                                          ),
                                        )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-end gap-2 ">
                            <Button
                              size="sm"
                              variant="outlined"
                              onClick={() => setDisplayColumns(columns)}
                            >
                              {t("Select all")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outlined"
                              onClick={() => setDisplayColumns([])}
                            >
                              {t("Select none")}
                            </Button>
                          </div>
                        </Popover>
                        <DownloadVersionFile
                          file={currentFile}
                          variant="outlined"
                          size="sm"
                        />
                      </div>
                    )}
                    <DatasetFileDataGrid
                      file={currentFile}
                      columns={displayColumns}
                    />
                  </div>
                </Tabs.Tab>
              </Tabs>
            </Block>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <MagnifyingGlassIcon className="w-8 h-8 mb-2" />
            <p>{t("Select a file to view its sample data and metadata.")}</p>
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
    ${DatasetFileDataGrid.fragments.file}
  `,
  version: gql`
    fragment DatasetExplorerDatasetVersion_version on DatasetVersion {
      id
      ...DatasetFilesExplorer_version
    }
    ${DatasetFilesExplorer.fragments.version}
  `,
};

export default DatasetExplorer;
