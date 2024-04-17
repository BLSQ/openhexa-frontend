import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspaceNotebooksPickerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  query: Types.Scalars['String']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type WorkspaceNotebooksPickerQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, bucket: { __typename?: 'Bucket', objects: { __typename?: 'BucketObjectPage', hasNextPage: boolean, items: Array<{ __typename?: 'BucketObject', name: string, key: string, path: string }> } } } | null };


export const WorkspaceNotebooksPickerDocument = gql`
    query WorkspaceNotebooksPicker($slug: String!, $query: String!, $page: Int) {
  workspace(slug: $slug) {
    slug
    bucket {
      objects(query: $query, page: $page) {
        items {
          name
          key
          path
        }
        hasNextPage
      }
    }
  }
}
    `;

/**
 * __useWorkspaceNotebooksPickerQuery__
 *
 * To run a query within a React component, call `useWorkspaceNotebooksPickerQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceNotebooksPickerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceNotebooksPickerQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      query: // value for 'query'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useWorkspaceNotebooksPickerQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables> & ({ variables: WorkspaceNotebooksPickerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables>(WorkspaceNotebooksPickerDocument, options);
      }
export function useWorkspaceNotebooksPickerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables>(WorkspaceNotebooksPickerDocument, options);
        }
export function useWorkspaceNotebooksPickerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables>(WorkspaceNotebooksPickerDocument, options);
        }
export type WorkspaceNotebooksPickerQueryHookResult = ReturnType<typeof useWorkspaceNotebooksPickerQuery>;
export type WorkspaceNotebooksPickerLazyQueryHookResult = ReturnType<typeof useWorkspaceNotebooksPickerLazyQuery>;
export type WorkspaceNotebooksPickerSuspenseQueryHookResult = ReturnType<typeof useWorkspaceNotebooksPickerSuspenseQuery>;
export type WorkspaceNotebooksPickerQueryResult = Apollo.QueryResult<WorkspaceNotebooksPickerQuery, WorkspaceNotebooksPickerQueryVariables>;