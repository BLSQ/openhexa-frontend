import * as Types from '../../graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspacesPageQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type WorkspacesPageQuery = { __typename?: 'Query', workspaces: { __typename?: 'WorkspacePage', totalItems: number, items: Array<{ __typename?: 'Workspace', id: string, name: string, countries: Array<{ __typename?: 'Country', code: string, flag: string }> }> } };

export type WorkspacePageQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type WorkspacePageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, name: string, description?: string | null, countries: Array<{ __typename?: 'Country', code: string, flag: string }>, members: { __typename?: 'WorkspaceMembershipPage', totalItems: number, items: Array<{ __typename?: 'WorkspaceMembership', id: string, role: Types.WorkspaceMembershipRole, createdAt: any, user: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, email: string } }> } } | null };


export const WorkspacesPageDocument = gql`
    query WorkspacesPage($page: Int, $perPage: Int) {
  workspaces(page: $page, perPage: $perPage) {
    totalItems
    items {
      id
      name
      countries {
        code
        flag
      }
    }
  }
}
    `;

/**
 * __useWorkspacesPageQuery__
 *
 * To run a query within a React component, call `useWorkspacesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPageQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useWorkspacesPageQuery(baseOptions?: Apollo.QueryHookOptions<WorkspacesPageQuery, WorkspacesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPageQuery, WorkspacesPageQueryVariables>(WorkspacesPageDocument, options);
      }
export function useWorkspacesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPageQuery, WorkspacesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPageQuery, WorkspacesPageQueryVariables>(WorkspacesPageDocument, options);
        }
export type WorkspacesPageQueryHookResult = ReturnType<typeof useWorkspacesPageQuery>;
export type WorkspacesPageLazyQueryHookResult = ReturnType<typeof useWorkspacesPageLazyQuery>;
export type WorkspacesPageQueryResult = Apollo.QueryResult<WorkspacesPageQuery, WorkspacesPageQueryVariables>;
export const WorkspacePageDocument = gql`
    query WorkspacePage($id: String!, $page: Int, $perPage: Int) {
  workspace(id: $id) {
    id
    name
    description
    countries {
      code
      flag
    }
    members(page: $page, perPage: $perPage) {
      totalItems
      items {
        id
        role
        user {
          id
          firstName
          lastName
          email
        }
        createdAt
      }
    }
  }
}
    `;

/**
 * __useWorkspacePageQuery__
 *
 * To run a query within a React component, call `useWorkspacePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacePageQuery({
 *   variables: {
 *      id: // value for 'id'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useWorkspacePageQuery(baseOptions: Apollo.QueryHookOptions<WorkspacePageQuery, WorkspacePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacePageQuery, WorkspacePageQueryVariables>(WorkspacePageDocument, options);
      }
export function useWorkspacePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacePageQuery, WorkspacePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacePageQuery, WorkspacePageQueryVariables>(WorkspacePageDocument, options);
        }
export type WorkspacePageQueryHookResult = ReturnType<typeof useWorkspacePageQuery>;
export type WorkspacePageLazyQueryHookResult = ReturnType<typeof useWorkspacePageLazyQuery>;
export type WorkspacePageQueryResult = Apollo.QueryResult<WorkspacePageQuery, WorkspacePageQueryVariables>;