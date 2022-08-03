import { gql } from "@apollo/client";
import { ChevronRightIcon } from "@heroicons/react/solid";
import DataGrid, { Column } from "core/components/DataGrid";
import Filesize from "core/components/Filesize";
import Link from "core/components/Link";
import Time from "core/components/Time";
import { CollectionElementType } from "graphql-types";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { CollectionElementsTable_ElementFragment } from "./CollectionElementsTable.generated";

type CollectionElementsTableProps = {
  renderAs: CollectionElementType;
  elements: CollectionElementsTable_ElementFragment[];
};

const CollectionElementsTable = (props: CollectionElementsTableProps) => {
  const { renderAs, elements } = props;
  const { t } = useTranslation();

  const columns = useMemo<Column[]>(() => {
    switch (renderAs) {
      case CollectionElementType.DHIS2DataElement:
        return [
          {
            Header: t("Name"),
            minWidth: 300,
            accessor: "dhis2",
            Cell: (cell) => (
              <div className="text-gray-600">
                {cell.value.name}
                <div className="mt-1 text-xs">
                  <Link
                    color="text-gray-400"
                    hoverColor="text-gray-500"
                    href={{
                      pathname: "/dhis2/[id]",
                      query: { id: cell.value.id },
                    }}
                  >
                    {cell.value.instance.name}
                  </Link>
                </div>
              </div>
            ),
          },
          {
            Header: t("Code"),
            accessor: "dhis2.code",
          },
          {
            Header: t("Last extracted"),
            accessor: "updatedAt",
            Cell: (cell) => <Time datetime={cell.value} />,
          },
          {
            Header: "",
            accessor: "dhis2",
            id: "actions",
            Cell: (cell) => (
              <div className="flex w-full items-center justify-end gap-2">
                <Link
                  className="flex items-center gap-0.5 "
                  href={{
                    pathname: "/dhis2/[instanceId]/data-elements/[elementId]",
                    query: {
                      instanceId: cell.value.instance.id,
                      elementId: cell.value.id,
                    },
                  }}
                >
                  <span className="font-medium">{t("View")}</span>
                  <ChevronRightIcon className="inline h-5" />
                </Link>
              </div>
            ),
          },
        ];
      case CollectionElementType.S3Object:
        return [
          {
            Header: t("Name"),
            accessor: "s3",
            Cell: (cell) => (
              <div className="text-gray-600 lg:whitespace-nowrap">
                {cell.value.filename}
                <div className="mt-1 text-xs text-gray-400">
                  {cell.value.bucket.name}
                </div>
              </div>
            ),
          },
          {
            Header: t("Type"),
            accessor: "s3.type",
          },
          {
            Header: t("Size"),
            accessor: "s3.size",
            Cell: (cell) => <Filesize size={cell.value} />,
          },

          {
            Header: t("Created"),
            accessor: "createdAt",
            Cell: (cell) => <Time datetime={cell.value} />,
          },
          {
            Header: "",
            accessor: "s3",
            id: "actions",
            Cell: (cell) => (
              <div className="flex w-full items-center justify-end gap-2">
                <Link
                  className="flex items-center gap-0.5 font-medium"
                  href={`/s3/${encodeURIComponent(
                    cell.value.bucket.id
                  )}/object/${cell.value.key}`}
                >
                  <span className="font-medium">{t("View")}</span>
                  <ChevronRightIcon className="inline h-5" />
                </Link>
              </div>
            ),
          },
        ];
      default:
        return [
          {
            Header: t("ID"),
            accessor: "id",
          },
          {
            Header: t("Created"),
            accessor: "Created",
            Cell: (cell) => <Time datetime={cell.value} />,
          },
          {
            Header: t("Updated"),
            accessor: "updatedAt",
            Cell: (cell) => <Time datetime={cell.value} />,
          },
        ];
    }
  }, [renderAs, t]);

  return <DataGrid columns={columns} data={elements} />;
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
