import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PipelineRecipientQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type PipelineRecipientQuery = { __typename?: 'Query', pipeline?: { __typename?: 'Pipeline', id: string, code: string, permissions: { __typename?: 'PipelinePermissions', update: boolean }, recipients: Array<{ __typename?: 'PipelineRecipient', id: string, notificationEvent: Types.PipelineNotificationEvent, user: { __typename?: 'User', id: string, displayName: string } }>, workspace: { __typename?: 'Workspace', slug: string } } | null };

export type PipelineRecipients_PipelineFragment = { __typename?: 'Pipeline', id: string, code: string };

export const PipelineRecipients_PipelineFragmentDoc = gql`
    fragment PipelineRecipients_pipeline on Pipeline {
  id
  code
}
    `;
export const PipelineRecipientDocument = gql`
    query PipelineRecipient($id: UUID!) {
  pipeline(id: $id) {
    id
    code
    permissions {
      update
    }
    recipients {
      id
      user {
        id
        displayName
      }
      notificationEvent
    }
    workspace {
      slug
    }
  }
}
    `;

/**
 * __usePipelineRecipientQuery__
 *
 * To run a query within a React component, call `usePipelineRecipientQuery` and pass it any options that fit your needs.
 * When your component renders, `usePipelineRecipientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePipelineRecipientQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePipelineRecipientQuery(baseOptions: Apollo.QueryHookOptions<PipelineRecipientQuery, PipelineRecipientQueryVariables> & ({ variables: PipelineRecipientQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PipelineRecipientQuery, PipelineRecipientQueryVariables>(PipelineRecipientDocument, options);
      }
export function usePipelineRecipientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PipelineRecipientQuery, PipelineRecipientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PipelineRecipientQuery, PipelineRecipientQueryVariables>(PipelineRecipientDocument, options);
        }
export function usePipelineRecipientSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PipelineRecipientQuery, PipelineRecipientQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PipelineRecipientQuery, PipelineRecipientQueryVariables>(PipelineRecipientDocument, options);
        }
export type PipelineRecipientQueryHookResult = ReturnType<typeof usePipelineRecipientQuery>;
export type PipelineRecipientLazyQueryHookResult = ReturnType<typeof usePipelineRecipientLazyQuery>;
export type PipelineRecipientSuspenseQueryHookResult = ReturnType<typeof usePipelineRecipientSuspenseQuery>;
export type PipelineRecipientQueryResult = Apollo.QueryResult<PipelineRecipientQuery, PipelineRecipientQueryVariables>;