import { gql } from "@apollo/client";
import { BaseColumn } from "core/components/DataGrid";
import ChevronLinkColumn from "core/components/DataGrid/ChevronLinkColumn";
import DataGrid from "core/components/DataGrid/DataGrid";
import DateColumn from "core/components/DataGrid/DateColumn";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import Filesize from "core/components/Filesize";
import { CollectionElementType } from "graphql-types";
import { useTranslation } from "next-i18next";
import { CollectionElementsTable_ElementFragment } from "./CollectionElementsTable.generated";

type CollectionElementsTableProps = {
  renderAs: CollectionElementType;
  elements: CollectionElementsTable_ElementFragment[];
};

const CollectionElementsTable = (props: CollectionElementsTableProps) => {
  const { renderAs, elements } = props;
  const { t } = useTranslation();

  switch (renderAs) {
    case CollectionElementType.DHIS2DataElement:
      return (
        <DataGrid data={elements}>
          <TextColumn
            label="Name"
            accessor="dhis2"
            textPath="name"
            subtextPath="instance.name"
            minWidth={300}
          />
          <BaseColumn label="Code" accessor="dhis2.code" />
          <DateColumn label="Last Extracted" accessor="updatedAt" />
          <ChevronLinkColumn
            hideLabel
            accessor="dhis2"
            url={(value: any) => ({
              pathname: "/dhis2/[instanceId]/data-elements/[elementId]",
              query: {
                instanceId: value.instance.id,
                elementId: value.id,
              },
            })}
          />
        </DataGrid>
      );
    case CollectionElementType.S3Object:
      return (
        <DataGrid data={elements}>
          <TextColumn
            id="name"
            label={t("Name")}
            accessor="s3"
            textPath="filename"
            subtextPath="bucket.name"
            minWidth={300}
          />
          <BaseColumn label="Type" accessor="s3.type" />
          <BaseColumn label="Size" accessor="s3.size">
            {(value) => <Filesize size={value} />}
          </BaseColumn>
          <DateColumn label={t("Created")} accessor="createdAt" />
          <ChevronLinkColumn
            accessor="s3"
            className=""
            hideLabel
            url={(value: any) =>
              `/s3/${encodeURIComponent(value.bucket.id)}/object/${value.key}`
            }
          />
        </DataGrid>
      );

    default:
      return null;
  }
};

const Registry = {
  getFragments(v: string) {
    return ``;
  },
};

CollectionElementsTable.fragments = {
  element: gql`
    fragment CollectionElementsTable_element on CollectionElement {
      id
      createdAt
      updatedAt
      ... on DHIS2DataElementCollectionElement {
        dhis2: element {
          id
          name
          code
          instance {
            id
            name
          }
        }
      }
      ${Registry.getFragments("CollectionElementsTable")}
      ... on S3ObjectCollectionElement {
        s3: element {
          id
          type
          size
          key
          filename
          storageClass
          bucket {
            id
            name
          }
        }
      }
    }
  `,
};

export default CollectionElementsTable;
