import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DatasetFileSummaryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DatasetFileSummaryQuery = { __typename?: 'Query', datasetVersionFile?: { __typename?: 'DatasetVersionFile', id: string, filename: string, contentType: string, createdAt: any } | null };

export type DatasetFileSummary_FileFragment = { __typename?: 'DatasetVersionFile', id: string };

export const DatasetFileSummary_FileFragmentDoc = gql`
    fragment DatasetFileSummary_file on DatasetVersionFile {
  id
}
    `;
export const DatasetFileSummaryDocument = gql`
    query datasetFileSummary($id: ID!) {
  datasetVersionFile(id: $id) {
    id
    filename
    contentType
    createdAt
  }
}
    `;

/**
 * __useDatasetFileSummaryQuery__
 *
 * To run a query within a React component, call `useDatasetFileSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetFileSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetFileSummaryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDatasetFileSummaryQuery(baseOptions: Apollo.QueryHookOptions<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables> & ({ variables: DatasetFileSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables>(DatasetFileSummaryDocument, options);
      }
export function useDatasetFileSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables>(DatasetFileSummaryDocument, options);
        }
export function useDatasetFileSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables>(DatasetFileSummaryDocument, options);
        }
export type DatasetFileSummaryQueryHookResult = ReturnType<typeof useDatasetFileSummaryQuery>;
export type DatasetFileSummaryLazyQueryHookResult = ReturnType<typeof useDatasetFileSummaryLazyQuery>;
export type DatasetFileSummarySuspenseQueryHookResult = ReturnType<typeof useDatasetFileSummarySuspenseQuery>;
export type DatasetFileSummaryQueryResult = Apollo.QueryResult<DatasetFileSummaryQuery, DatasetFileSummaryQueryVariables>;