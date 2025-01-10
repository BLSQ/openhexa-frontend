import { gql, useQuery } from "@apollo/client";
import { PencilIcon } from "@heroicons/react/24/outline";
import Badge from "core/components/Badge";
import Button from "core/components/Button";
import Spinner from "core/components/Spinner";
import { Table, TableBody, TableCell, TableRow } from "core/components/Table";
import Title from "core/components/Title";
import { trackEvent } from "core/helpers/analytics";
import { percentage } from "datasets/helpers/dataset";
import { MetadataAttribute } from "graphql/types";
import { camelCase } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DatasetVersionFileColumns_FileFragment,
  DatasetVersionFileColumns_VersionFragment,
} from "./DatasetVersionFileColumns.generated";
import Drawer from "core/components/Drawer/Drawer";
import Dialog from "core/components/Dialog";

export type DatasetColumn = {
  id: string;
  columnName: string;
  constantValues?: boolean;
  dataType: string;
  distinctValues: number;
  key: string;
  missingValues: number;
  system: boolean;
  uniqueValues?: number;
  count: number;
};

type DatasetVersionFileColumnsProps = {
  file: DatasetVersionFileColumns_FileFragment;
  version: DatasetVersionFileColumns_VersionFragment;
};

const DatasetVersionFileColumns = (props: DatasetVersionFileColumnsProps) => {
  const { t } = useTranslation();
  const { file, version } = props;
  const { data, loading } = useQuery(
    gql`
      query DatasetVersionFileColumnsMetadata($id: ID!) {
        datasetVersionFile(id: $id) {
          id
          attributes {
            id
            key
            value
            system
          }
        }
      }
    `,
    {
      variables: {
        id: file.id,
      },
    },
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const { dataset } = version;
    if (dataset) {
      trackEvent("datasets.dataset_file_metadata_accessed", {
        dataset_id: dataset.slug,
        workspace: dataset?.workspace?.slug,
        dataset_version: version.name,
        filename: file.filename,
      });
    }
  }, []);

  const { columns, total } = useMemo(() => {
    if (!data?.datasetVersionFile.attributes) {
      return { columns: [], total: 0 };
    }

    const { attributes } = data.datasetVersionFile;
    const res: Array<DatasetColumn> = Object.values(
      attributes.reduce((acc: any, item: MetadataAttribute) => {
        const [columnKey, property] = item.key.split(".");
        if (!acc[columnKey]) {
          acc[columnKey] = {
            id: item.id,
            key: columnKey,
            system: item.system,
          };
        }
        acc[columnKey][camelCase(property)] = item.value;
        return acc;
      }, {}),
    );

    return {
      columns: res,
      total: res.length ? res[0].count + res[0].missingValues : 0,
    };
  }, [data]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-24 p-4">
        <Spinner size="md" />
      </div>
    );

  if (!columns.length) {
    return (
      <div className="text-sm text-gray-500 italic w-full flex justify-center p-4">
        {t("Columns metadata not available.")}
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-200">
        {columns.map((column: DatasetColumn) => (
          <div
            key={column.key}
            className="py-6 first:pt-2 hover:bg-gray-50 -mx-4 px-4 group relative"
          >
            <div className="absolute right-4 top-4 invisible group-hover:visible">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsDrawerOpen(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
            <Title level={3}>{column.columnName}</Title>
            <div className="flex flex-row divide divide-x divide-gray-200">
              <Table className="flex-1/3 flex-grow-0 ">
                <TableBody className="font-mono">
                  <TableRow>
                    <TableCell spacing="tight">{t("Distinct")}</TableCell>
                    <TableCell spacing="tight">
                      {`${column.distinctValues} (${total ? `${percentage(column.distinctValues, total)}%` : "-"})`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell spacing="tight">{t("Missing")}</TableCell>
                    <TableCell spacing="tight">
                      {`${column.missingValues} (${total ? `${percentage(column.missingValues, total)}%` : "-"})`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell spacing="tight">{t("Constant")}</TableCell>
                    <TableCell spacing="tight">
                      {column.constantValues ? t("Yes") : t("No")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {false && (
                <div className="px-4">
                  <i>No description</i>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2 mt-2">
              <Badge
                defaultStyle={false}
                className="font-mono bg-amber-50 ring-amber-500/20"
                size="sm"
              >
                {column.dataType}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      {/* <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen}>
        <Drawer.Title>Coucou</Drawer.Title>
        <Drawer.Content>Content</Drawer.Content>
        <Drawer.Actions>
          <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
            Cancel
          </Button>
          <Button>Save</Button>
        </Drawer.Actions>
      </Drawer> */}
      <Dialog open={isDrawerOpen} onClose={setIsDrawerOpen}>
        <Dialog.Content>Coucou</Dialog.Content>
      </Dialog>
    </>
  );
};

DatasetVersionFileColumns.fragments = {
  file: gql`
    fragment DatasetVersionFileColumns_file on DatasetVersionFile {
      id
      filename
    }
  `,
  version: gql`
    fragment DatasetVersionFileColumns_version on DatasetVersion {
      name
      dataset {
        slug
        workspace {
          slug
        }
      }
    }
  `,
};

export default DatasetVersionFileColumns;
