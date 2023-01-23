import * as Types from '../../graphql-types';

import { gql } from '@apollo/client';
export type SearchResult_ResultFragment = { __typename?: 'SearchResult', rank: number, object: { __typename: 'CatalogEntry', id: any, name: string, objectId: string, objectUrl: any, symbol?: any | null, datasource?: { __typename?: 'Datasource', id: any, name: string } | null, type: { __typename?: 'CatalogEntryType', model: string, app: string, name: string } } | { __typename: 'Collection', id: any, name: string } };

export const SearchResult_ResultFragmentDoc = gql`
    fragment SearchResult_result on SearchResult {
  rank
  object {
    __typename
    ... on Collection {
      id
      name
    }
    ... on CatalogEntry {
      id
      name
      datasource {
        id
        name
      }
      type {
        model
        app
        name
      }
      objectId
      objectUrl
      symbol
    }
  }
}
    `;