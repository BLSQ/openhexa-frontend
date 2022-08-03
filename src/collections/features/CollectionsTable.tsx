import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "core/components/Table";
import { useTranslation } from "next-i18next";

import { gql } from "@apollo/client";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Pagination from "core/components/Pagination";
import Time from "core/components/Time";
import CountryBadge from "core/features/CountryBadge";
import Tag from "core/features/Tag";
import Link from "next/link";
import { CollectionsTable_PageFragment } from "./CollectionsTable.generated";

type CollectionsTableProps = {
  page: CollectionsTable_PageFragment;
  perPage: number;
  onChangePage: (page: number) => void;
};

const CollectionsTable = (props: CollectionsTableProps) => {
  const { page, perPage, onChangePage } = props;

  const { t } = useTranslation();

  if (!page) {
    return null;
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="w-72" heading>
              {t("Name")}
            </TableCell>
            <TableCell heading>{t("Locations")}</TableCell>
            <TableCell className="hidden lg:table-cell" heading>
              {t("Tags")}
            </TableCell>
            <TableCell heading>{t("Created")}</TableCell>
            <TableCell heading>{t("Author")}</TableCell>
            <TableCell heading>
              <span className="sr-only">{t("Actions")}</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {page.items.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell wrap className="">
                <Link
                  href={{
                    pathname: "/collections/[collectionId]",
                    query: { collectionId: collection.id },
                  }}
                >
                  <a className="font-medium text-gray-900">{collection.name}</a>
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {collection.countries.length === 0 && "-"}
                  {collection.countries.map((country) => (
                    <CountryBadge key={country.code} country={country} />
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex gap-2">
                  {collection.tags.length === 0 && "-"}
                  {collection.tags.slice(0, 2).map((tag) => (
                    <Tag key={tag.id} tag={tag} />
                  ))}
                  {collection.tags.length > 2 && (
                    <span>(+{collection.tags.length - 2})</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Time datetime={collection.createdAt} />
              </TableCell>
              <TableCell>{collection.author?.displayName}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Link
                    href={{
                      pathname: "/collections/[collectionId]",
                      query: { collectionId: collection.id },
                    }}
                  >
                    <a className="items-center font-medium text-blue-600 hover:text-blue-900">
                      <span>{t("View")}</span>
                      <ChevronRightIcon className="ml-1 inline h-4" />
                    </a>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        className="border-t border-gray-200 px-6 text-gray-500"
        countItems={page.items.length}
        totalItems={page.totalItems}
        page={page.pageNumber}
        perPage={perPage}
        totalPages={page.totalPages}
        onChange={onChangePage}
      />
    </>
  );
};

CollectionsTable.fragments = {
  page: gql`
    fragment CollectionsTable_page on CollectionPage {
      totalPages
      totalItems
      pageNumber
      items {
        id
        name
        createdAt
        updatedAt
        description
        author {
          displayName
        }
        countries {
          code
          ...CountryBadge_country
        }

        tags {
          id
          ...Tag_tag
        }

        ...CollectionActionsMenu_collection
      }
    }
  `,
};

export default CollectionsTable;
