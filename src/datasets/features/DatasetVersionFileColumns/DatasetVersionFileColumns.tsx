import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import Spinner from "core/components/Spinner";
import { MetadataAttribute } from "graphql/types";
import { camelCase } from "lodash";
import Card from "core/components/Card";
import DescriptionList from "core/components/DescriptionList";
import { useTranslation } from "react-i18next";
import Badge from "core/components/Badge";
import { percentage } from "datasets/helpers/dataset";

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
  totalValues: number;
};

type DatasetVersionFileColumnsProps = {
  file: any;
};

const DatasetVersionFileColumns = (props: DatasetVersionFileColumnsProps) => {
  const { t } = useTranslation();
  const { file } = props;
  const { data, loading } = useQuery(
    gql`
      query DatasetVersionFileMetadata($id: ID!) {
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

  const metadata: Array<DatasetColumn> = useMemo(() => {
    if (!data?.datasetVersionFile.attributes) {
      return [];
    }

    const { attributes } = data.datasetVersionFile;
    return Object.values(
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
  }, [data]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-24 p-4">
        <Spinner size="md" />
      </div>
    );

  if (!metadata.length) {
    return (
      <div className="text-sm text-gray-500 italic w-full flex justify-center p-4">
        {t("Columns metadata not available.")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {metadata.map((metadataAttribute: DatasetColumn) => (
        <Card
          className="min-h-36"
          key={metadataAttribute.key}
          title={
            <div className="flex justify-between items-start">
              <p className="font-semibold text-sm max-w-60">
                {metadataAttribute.columnName}
              </p>
              <Badge>{metadataAttribute.dataType}</Badge>
            </div>
          }
        >
          <Card.Content className="flex items-start">
            <DescriptionList>
              <DescriptionList.Item label={t("Distinct")}>
                <code className="font-mono text-sm text-gray-600">
                  {`${metadataAttribute.distinctValues}(${percentage(metadataAttribute.distinctValues, metadataAttribute.totalValues)}%)`}
                </code>
              </DescriptionList.Item>
              <DescriptionList.Item label={t("Missing")}>
                <code className="font-mono text-sm text-gray-600 -px-1">
                  {`${metadataAttribute.missingValues}(${percentage(metadataAttribute.missingValues, metadataAttribute.totalValues)}%)`}
                </code>
              </DescriptionList.Item>
            </DescriptionList>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

DatasetVersionFileColumns.fragments = {
  file: gql`
    fragment DatasetVersionFileColumns_file on DatasetVersionFile {
      id
    }
  `,
};

export default DatasetVersionFileColumns;
