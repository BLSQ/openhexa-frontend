import { gql } from "@apollo/client";
import { useMemo } from "react";
import { DatasetFileMetadata_FileFragment } from "./DatasetFileMetadata.generated";
import { useTranslation } from "react-i18next";
import Card from "core/components/Card";
import DescriptionList, {
  DescriptionListDisplayMode,
} from "core/components/DescriptionList";
import { capitalize } from "lodash";

type DatasetFileMetadataProps = {
  file: DatasetFileMetadata_FileFragment;
};

const DatasetFileMetadata = (props: DatasetFileMetadataProps) => {
  const { t } = useTranslation();
  const { file } = props;
  const { metadata } = file;

  const attributes = useMemo(() => {
    const attr: { [key: string]: { [key: string]: string } } = {};
    if (metadata) {
      metadata.attributes.map((attribute) => {
        const [key, metadataName] = attribute.key.split(".");
        if (!key || !metadataName) return attr; // Ensure valid key structure

        attr[key] = {
          ...attr[key],
          [metadataName]: attribute.value,
        };
      });
    }
    return attr;
  }, [metadata]);

  if (!metadata) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        {metadata.attributes &&
          Object.keys(attributes).map((attribute, id) => (
            <Card
              key={id}
              title={capitalize(attribute.split("_").join(" ").toString())}
            >
              <Card.Content className="mt-3 line-clamp-3 text-sm">
                <DescriptionList
                  columns={4}
                  displayMode={DescriptionListDisplayMode.LABEL_ABOVE}
                >
                  {Object.keys(attributes[attribute]).map((key: string) => (
                    <DescriptionList.Item
                      key={key}
                      label={key}
                      className="font-semibold"
                    >
                      {attributes[attribute][key]}
                    </DescriptionList.Item>
                  ))}
                </DescriptionList>
              </Card.Content>
            </Card>
          ))}
      </div>
      {!metadata.attributes.length && (
        <div className="flex justify-center text-gray-500">
          <p className="text-gray-500">{t("File metadata not available.")}</p>
        </div>
      )}
    </>
  );
};

DatasetFileMetadata.fragments = {
  file: gql`
    fragment DatasetFileMetadata_file on DatasetVersionFile {
      metadata {
        attributes {
          id
          key
          value
        }
      }
    }
  `,
};

export default DatasetFileMetadata;
