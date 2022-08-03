import * as Types from "../../graphql-types";

import { gql } from "@apollo/client";
import { CountryBadge_CountryFragmentDoc } from "../../core/features/CountryBadge.generated";
import { Tag_TagFragmentDoc } from "../../core/features/Tag.generated";
import { CollectionActionsMenu_CollectionFragmentDoc } from "./CollectionActionsMenu.generated";
export type CollectionsTable_PageFragment = {
  __typename?: "CollectionPage";
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  items: Array<{
    __typename?: "Collection";
    id: string;
    name: string;
    createdAt: any;
    updatedAt: any;
    description?: string | null;
    author?: { __typename?: "User"; displayName: string } | null;
    countries: Array<{
      __typename?: "Country";
      code: string;
      name: string;
      flag: string;
    }>;
    tags: Array<{ __typename?: "Tag"; id: string; name: string }>;
    authorizedActions: {
      __typename?: "CollectionAuthorizedActions";
      canDelete: boolean;
      canUpdate: boolean;
    };
  }>;
};

export const CollectionsTable_PageFragmentDoc = gql`
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
  ${CountryBadge_CountryFragmentDoc}
  ${Tag_TagFragmentDoc}
  ${CollectionActionsMenu_CollectionFragmentDoc}
`;
