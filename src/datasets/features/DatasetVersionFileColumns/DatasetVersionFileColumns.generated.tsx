import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DatasetVersionFileMetadataQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DatasetVersionFileMetadataQuery = { __typename?: 'Query', datasetVersionFile?: { __typename?: 'DatasetVersionFile', id: string, attributes: Array<{ __typename?: 'MetadataAttribute', id: string, key: string, value?: any | null, system: boolean }> } | null };

export type DatasetVersionFileColumns_FileFragment = { __typename?: 'DatasetVersionFile', id: string };

export const DatasetVersionFileColumns_FileFragmentDoc = gql`
    fragment DatasetVersionFileColumns_file on DatasetVersionFile {
  id
}
    `;
export const DatasetVersionFileMetadataDocument = gql`
    query DatasetVersionFileMetadata($id: ID!) {
  datasetVersionFile(id: $id) {
    id
    attributes {
      id
      key
      value
      system
    }
  }
}
    `;

/**
 * __useDatasetVersionFileMetadataQuery__
 *
 * To run a query within a React component, call `useDatasetVersionFileMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetVersionFileMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetVersionFileMetadataQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDatasetVersionFileMetadataQuery(baseOptions: Apollo.QueryHookOptions<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables> & ({ variables: DatasetVersionFileMetadataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables>(DatasetVersionFileMetadataDocument, options);
      }
export function useDatasetVersionFileMetadataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables>(DatasetVersionFileMetadataDocument, options);
        }
export function useDatasetVersionFileMetadataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables>(DatasetVersionFileMetadataDocument, options);
        }
export type DatasetVersionFileMetadataQueryHookResult = ReturnType<typeof useDatasetVersionFileMetadataQuery>;
export type DatasetVersionFileMetadataLazyQueryHookResult = ReturnType<typeof useDatasetVersionFileMetadataLazyQuery>;
export type DatasetVersionFileMetadataSuspenseQueryHookResult = ReturnType<typeof useDatasetVersionFileMetadataSuspenseQuery>;
export type DatasetVersionFileMetadataQueryResult = Apollo.QueryResult<DatasetVersionFileMetadataQuery, DatasetVersionFileMetadataQueryVariables>;