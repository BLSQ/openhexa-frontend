import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DatasetFilesDataGridQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DatasetFilesDataGridQuery = { __typename?: 'Query', datasetVersionFile?: { __typename?: 'DatasetVersionFile', id: string, fileSample?: { __typename?: 'DatasetFileSample', sample?: any | null } | null } | null };

export type DatasetFileDataGrid_FileFragment = { __typename?: 'DatasetVersionFile', id: string };

export const DatasetFileDataGrid_FileFragmentDoc = gql`
    fragment DatasetFileDataGrid_file on DatasetVersionFile {
  id
}
    `;
export const DatasetFilesDataGridDocument = gql`
    query DatasetFilesDataGrid($id: ID!) {
  datasetVersionFile(id: $id) {
    id
    fileSample {
      sample
    }
  }
}
    `;

/**
 * __useDatasetFilesDataGridQuery__
 *
 * To run a query within a React component, call `useDatasetFilesDataGridQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetFilesDataGridQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetFilesDataGridQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDatasetFilesDataGridQuery(baseOptions: Apollo.QueryHookOptions<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables> & ({ variables: DatasetFilesDataGridQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables>(DatasetFilesDataGridDocument, options);
      }
export function useDatasetFilesDataGridLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables>(DatasetFilesDataGridDocument, options);
        }
export function useDatasetFilesDataGridSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables>(DatasetFilesDataGridDocument, options);
        }
export type DatasetFilesDataGridQueryHookResult = ReturnType<typeof useDatasetFilesDataGridQuery>;
export type DatasetFilesDataGridLazyQueryHookResult = ReturnType<typeof useDatasetFilesDataGridLazyQuery>;
export type DatasetFilesDataGridSuspenseQueryHookResult = ReturnType<typeof useDatasetFilesDataGridSuspenseQuery>;
export type DatasetFilesDataGridQueryResult = Apollo.QueryResult<DatasetFilesDataGridQuery, DatasetFilesDataGridQueryVariables>;