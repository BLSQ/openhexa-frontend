import * as Types from '../../graphql/types';

import { gql } from '@apollo/client';
import { WorkspaceLayout_WorkspaceFragmentDoc } from '../../workspaces/layouts/WorkspaceLayout/WorkspaceLayout.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WebappsPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type WebappsPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean, update: boolean, launchNotebookServer: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null, webapps: { __typename?: 'WebappsPage', totalPages: number, totalItems: number, items: Array<{ __typename?: 'Webapp', id: string, name: string, description?: string | null, url: string, isFavorite: boolean, permissions: { __typename?: 'WebappPermissions', update: boolean, delete: boolean } }> } };


export const WebappsPageDocument = gql`
    query WebappsPage($workspaceSlug: String!, $page: Int, $perPage: Int = 15) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...WorkspaceLayout_workspace
  }
  webapps(workspaceSlug: $workspaceSlug, page: $page, perPage: $perPage) {
    totalPages
    totalItems
    items {
      id
      name
      description
      url
      isFavorite
      permissions {
        update
        delete
      }
    }
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWebappsPageQuery__
 *
 * To run a query within a React component, call `useWebappsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWebappsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWebappsPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useWebappsPageQuery(baseOptions: Apollo.QueryHookOptions<WebappsPageQuery, WebappsPageQueryVariables> & ({ variables: WebappsPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WebappsPageQuery, WebappsPageQueryVariables>(WebappsPageDocument, options);
      }
export function useWebappsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WebappsPageQuery, WebappsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WebappsPageQuery, WebappsPageQueryVariables>(WebappsPageDocument, options);
        }
export function useWebappsPageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WebappsPageQuery, WebappsPageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WebappsPageQuery, WebappsPageQueryVariables>(WebappsPageDocument, options);
        }
export type WebappsPageQueryHookResult = ReturnType<typeof useWebappsPageQuery>;
export type WebappsPageLazyQueryHookResult = ReturnType<typeof useWebappsPageLazyQuery>;
export type WebappsPageSuspenseQueryHookResult = ReturnType<typeof useWebappsPageSuspenseQuery>;
export type WebappsPageQueryResult = Apollo.QueryResult<WebappsPageQuery, WebappsPageQueryVariables>;