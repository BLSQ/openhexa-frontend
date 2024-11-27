import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspaceCandidatesPicker_ValueFragment = { __typename?: 'User', displayName: string, email: string };

export type WorkspaceCandidatesQueryVariables = Types.Exact<{
  query: Types.Scalars['String']['input'];
  workspace: Types.Scalars['String']['input'];
}>;


export type WorkspaceCandidatesQuery = { __typename?: 'Query', workspaceCandidates: { __typename?: 'WorkspaceCandidatesResult', items: Array<{ __typename?: 'User', displayName: string, email: string }> } };

export const WorkspaceCandidatesPicker_ValueFragmentDoc = gql`
    fragment WorkspaceCandidatesPicker_value on User {
  displayName
  email
}
    `;
export const WorkspaceCandidatesDocument = gql`
    query WorkspaceCandidates($query: String!, $workspace: String!) {
  workspaceCandidates(query: $query, workspace: $workspace) {
    items {
      ...WorkspaceCandidatesPicker_value
    }
  }
}
    ${WorkspaceCandidatesPicker_ValueFragmentDoc}`;

/**
 * __useWorkspaceCandidatesQuery__
 *
 * To run a query within a React component, call `useWorkspaceCandidatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceCandidatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceCandidatesQuery({
 *   variables: {
 *      query: // value for 'query'
 *      workspace: // value for 'workspace'
 *   },
 * });
 */
export function useWorkspaceCandidatesQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables> & ({ variables: WorkspaceCandidatesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables>(WorkspaceCandidatesDocument, options);
      }
export function useWorkspaceCandidatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables>(WorkspaceCandidatesDocument, options);
        }
export function useWorkspaceCandidatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables>(WorkspaceCandidatesDocument, options);
        }
export type WorkspaceCandidatesQueryHookResult = ReturnType<typeof useWorkspaceCandidatesQuery>;
export type WorkspaceCandidatesLazyQueryHookResult = ReturnType<typeof useWorkspaceCandidatesLazyQuery>;
export type WorkspaceCandidatesSuspenseQueryHookResult = ReturnType<typeof useWorkspaceCandidatesSuspenseQuery>;
export type WorkspaceCandidatesQueryResult = Apollo.QueryResult<WorkspaceCandidatesQuery, WorkspaceCandidatesQueryVariables>;