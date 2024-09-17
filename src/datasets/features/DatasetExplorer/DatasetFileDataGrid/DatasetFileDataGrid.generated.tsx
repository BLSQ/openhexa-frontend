import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DatasetFileDataGridQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DatasetFileDataGridQuery = { __typename?: 'Query', datasetVersionFile?: { __typename?: 'DatasetVersionFile', id: string, fileSample?: { __typename?: 'DatasetFileSample', sample?: any | null, status: Types.FileSampleStatus } | null } | null };

export type DatasetFileDataGrid_FileFragment = { __typename?: 'DatasetVersionFile', id: string, fileSample?: { __typename?: 'DatasetFileSample', sample?: any | null, status: Types.FileSampleStatus } | null };

export const DatasetFileDataGrid_FileFragmentDoc = gql`
    fragment DatasetFileDataGrid_file on DatasetVersionFile {
  id
  fileSample {
    sample
    status
  }
}
    `;
export const DatasetFileDataGridDocument = gql`
    query DatasetFileDataGrid($id: ID!) {
  datasetVersionFile(id: $id) {
    id
    fileSample {
      sample
      status
    }
  }
}
    `;

/**
 * __useDatasetFileDataGridQuery__
 *
 * To run a query within a React component, call `useDatasetFileDataGridQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetFileDataGridQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetFileDataGridQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDatasetFileDataGridQuery(baseOptions: Apollo.QueryHookOptions<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables> & ({ variables: DatasetFileDataGridQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables>(DatasetFileDataGridDocument, options);
      }
export function useDatasetFileDataGridLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables>(DatasetFileDataGridDocument, options);
        }
export function useDatasetFileDataGridSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables>(DatasetFileDataGridDocument, options);
        }
export type DatasetFileDataGridQueryHookResult = ReturnType<typeof useDatasetFileDataGridQuery>;
export type DatasetFileDataGridLazyQueryHookResult = ReturnType<typeof useDatasetFileDataGridLazyQuery>;
export type DatasetFileDataGridSuspenseQueryHookResult = ReturnType<typeof useDatasetFileDataGridSuspenseQuery>;
export type DatasetFileDataGridQueryResult = Apollo.QueryResult<DatasetFileDataGridQuery, DatasetFileDataGridQueryVariables>;