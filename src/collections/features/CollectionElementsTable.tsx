import { gql } from "@apollo/client";
import DataGrid, { Cell, Column } from "core/components/DataGrid";
import filesize from "filesize";
import Time from "core/components/Time";
import { CollectionElementType } from "graphql-types";
import { useTranslation } from "next-i18next";
import Link from "core/components/Link";
import { useMemo } from "react";
import { CollectionElementsTable_ElementFragment } from "./CollectionElementsTable.generated";
import { ChevronRightIcon } from "@heroicons/react/solid";

type CollectionElementsTableProps = {
  renderAs: CollectionElementType;
  elements: CollectionElementsTable_ElementFragment[];
};

const CollectionElementsTable = (props: CollectionElementsTableProps) => {
  const { renderAs, elements } = props;
  const { t } = useTranslation();

  console.log(elements);
  const columns = useMemo<Column[]>(() => {
    switch (renderAs) {
      case CollectionElementType.DHIS2DataElement:
        return [
          {
            Header: t("Name"),
            minWidth: 300,
            accessor: "dhis2.name",
            Cell: (cell) => <span className="text-gray-600">{cell.value}</span>,
          },
          {
            Header: t("Code"),
            accessor: "dhis2.code",
          },
          {
            Header: t("Instance"),
            accessor: "dhis2.instance",
            Cell: (cell) => (
              <Link
                href={{
                  pathname: "/dhis2/[id]",
                  query: { id: cell.value.id },
                }}
              >
                {cell.value.name}
              </Link>
            ),
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
            Cell: (cell) => <span>filesize(cell.value)</span>,
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

  console.log(elements);

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
