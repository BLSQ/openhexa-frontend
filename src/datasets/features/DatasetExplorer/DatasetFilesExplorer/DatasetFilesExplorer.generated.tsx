import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DatasetFilesExplorerQueryVariables = Types.Exact<{
  versionId: Types.Scalars['ID']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type DatasetFilesExplorerQuery = { __typename?: 'Query', datasetVersion?: { __typename?: 'DatasetVersion', id: string, files: { __typename?: 'DatasetVersionFilePage', totalPages: number, totalItems: number, pageNumber: number, items: Array<{ __typename?: 'DatasetVersionFile', id: string, filename: string, contentType: string, createdAt: any }> } } | null };

export type DatasetFilesExplorer_VersionFragment = { __typename?: 'DatasetVersion', id: string };

export const DatasetFilesExplorer_VersionFragmentDoc = gql`
    fragment DatasetFilesExplorer_version on DatasetVersion {
  id
}
    `;
export const DatasetFilesExplorerDocument = gql`
    query DatasetFilesExplorer($versionId: ID!, $page: Int = 1, $perPage: Int = 15) {
  datasetVersion(id: $versionId) {
    id
    files(page: $page, perPage: $perPage) {
      items {
        id
        filename
        contentType
        createdAt
      }
      totalPages
      totalItems
      pageNumber
    }
  }
}
    `;

/**
 * __useDatasetFilesExplorerQuery__
 *
 * To run a query within a React component, call `useDatasetFilesExplorerQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetFilesExplorerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetFilesExplorerQuery({
 *   variables: {
 *      versionId: // value for 'versionId'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useDatasetFilesExplorerQuery(baseOptions: Apollo.QueryHookOptions<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables> & ({ variables: DatasetFilesExplorerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables>(DatasetFilesExplorerDocument, options);
      }
export function useDatasetFilesExplorerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables>(DatasetFilesExplorerDocument, options);
        }
export function useDatasetFilesExplorerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables>(DatasetFilesExplorerDocument, options);
        }
export type DatasetFilesExplorerQueryHookResult = ReturnType<typeof useDatasetFilesExplorerQuery>;
export type DatasetFilesExplorerLazyQueryHookResult = ReturnType<typeof useDatasetFilesExplorerLazyQuery>;
export type DatasetFilesExplorerSuspenseQueryHookResult = ReturnType<typeof useDatasetFilesExplorerSuspenseQuery>;
export type DatasetFilesExplorerQueryResult = Apollo.QueryResult<DatasetFilesExplorerQuery, DatasetFilesExplorerQueryVariables>;