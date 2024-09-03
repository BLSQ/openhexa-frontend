import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspaceDatasetFileExplorerQueryVariables = Types.Exact<{
  fileId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceDatasetFileExplorerQuery = { __typename?: 'Query', datasetVersionFile?: { __typename?: 'DatasetVersionFile', id: string, uri: string, filename: string, createdAt: any, contentType: string } | null };


export const WorkspaceDatasetFileExplorerDocument = gql`
    query WorkspaceDatasetFileExplorer($fileId: ID!) {
  datasetVersionFile(id: $fileId) {
    id
    uri
    filename
    createdAt
    contentType
  }
}
    `;

/**
 * __useWorkspaceDatasetFileExplorerQuery__
 *
 * To run a query within a React component, call `useWorkspaceDatasetFileExplorerQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceDatasetFileExplorerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceDatasetFileExplorerQuery({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useWorkspaceDatasetFileExplorerQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables> & ({ variables: WorkspaceDatasetFileExplorerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables>(WorkspaceDatasetFileExplorerDocument, options);
      }
export function useWorkspaceDatasetFileExplorerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables>(WorkspaceDatasetFileExplorerDocument, options);
        }
export function useWorkspaceDatasetFileExplorerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables>(WorkspaceDatasetFileExplorerDocument, options);
        }
export type WorkspaceDatasetFileExplorerQueryHookResult = ReturnType<typeof useWorkspaceDatasetFileExplorerQuery>;
export type WorkspaceDatasetFileExplorerLazyQueryHookResult = ReturnType<typeof useWorkspaceDatasetFileExplorerLazyQuery>;
export type WorkspaceDatasetFileExplorerSuspenseQueryHookResult = ReturnType<typeof useWorkspaceDatasetFileExplorerSuspenseQuery>;
export type WorkspaceDatasetFileExplorerQueryResult = Apollo.QueryResult<WorkspaceDatasetFileExplorerQuery, WorkspaceDatasetFileExplorerQueryVariables>;