import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetConnectionBySlugQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String']['input'];
  connectionSlug: Types.Scalars['String']['input'];
  type: Types.Scalars['String']['input'];
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetConnectionBySlugQuery = { __typename?: 'Query', connectionBySlug?: { __typename?: 'CustomConnection' } | { __typename?: 'DHIS2Connection', queryMetadata: { __typename?: 'DHIS2QueryResult', totalCount?: number | null, error?: Types.Dhis2ConnectionError | null, items?: Array<{ __typename?: 'DHIS2MetadataItem', id: string, name: string }> | null } } | { __typename?: 'GCSConnection' } | { __typename?: 'IASOConnection' } | { __typename?: 'PostgreSQLConnection' } | { __typename?: 'S3Connection' } | null };


export const GetConnectionBySlugDocument = gql`
    query getConnectionBySlug($workspaceSlug: String!, $connectionSlug: String!, $type: String!, $search: String, $limit: Int, $offset: Int) {
  connectionBySlug(workspaceSlug: $workspaceSlug, connectionSlug: $connectionSlug) {
    ... on DHIS2Connection {
      queryMetadata(type: $type, search: $search, limit: $limit, offset: $offset) {
        items {
          id
          name
        }
        totalCount
        error
      }
    }
  }
}
    `;

/**
 * __useGetConnectionBySlugQuery__
 *
 * To run a query within a React component, call `useGetConnectionBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectionBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectionBySlugQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *      connectionSlug: // value for 'connectionSlug'
 *      type: // value for 'type'
 *      search: // value for 'search'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetConnectionBySlugQuery(baseOptions: Apollo.QueryHookOptions<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables> & ({ variables: GetConnectionBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables>(GetConnectionBySlugDocument, options);
      }
export function useGetConnectionBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables>(GetConnectionBySlugDocument, options);
        }
export function useGetConnectionBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables>(GetConnectionBySlugDocument, options);
        }
export type GetConnectionBySlugQueryHookResult = ReturnType<typeof useGetConnectionBySlugQuery>;
export type GetConnectionBySlugLazyQueryHookResult = ReturnType<typeof useGetConnectionBySlugLazyQuery>;
export type GetConnectionBySlugSuspenseQueryHookResult = ReturnType<typeof useGetConnectionBySlugSuspenseQuery>;
export type GetConnectionBySlugQueryResult = Apollo.QueryResult<GetConnectionBySlugQuery, GetConnectionBySlugQueryVariables>;