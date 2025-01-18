import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAvailableUpgradePipelineTemplateVersionsQueryVariables = Types.Exact<{
  pipelineId: Types.Scalars['UUID']['input'];
}>;


export type GetAvailableUpgradePipelineTemplateVersionsQuery = { __typename?: 'Query', availableUpgradePipelineTemplateVersions: Array<{ __typename?: 'PipelineTemplateVersion', id: string, versionNumber: number, changelog?: string | null, createdAt: any }> };

export type UpgradePipelineFromTemplateDialog_PipelineFragment = { __typename?: 'Pipeline', id: string };

export const UpgradePipelineFromTemplateDialog_PipelineFragmentDoc = gql`
    fragment UpgradePipelineFromTemplateDialog_pipeline on Pipeline {
  id
}
    `;
export const GetAvailableUpgradePipelineTemplateVersionsDocument = gql`
    query GetAvailableUpgradePipelineTemplateVersions($pipelineId: UUID!) {
  availableUpgradePipelineTemplateVersions(pipelineId: $pipelineId) {
    id
    versionNumber
    changelog
    createdAt
  }
}
    `;

/**
 * __useGetAvailableUpgradePipelineTemplateVersionsQuery__
 *
 * To run a query within a React component, call `useGetAvailableUpgradePipelineTemplateVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableUpgradePipelineTemplateVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableUpgradePipelineTemplateVersionsQuery({
 *   variables: {
 *      pipelineId: // value for 'pipelineId'
 *   },
 * });
 */
export function useGetAvailableUpgradePipelineTemplateVersionsQuery(baseOptions: Apollo.QueryHookOptions<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables> & ({ variables: GetAvailableUpgradePipelineTemplateVersionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables>(GetAvailableUpgradePipelineTemplateVersionsDocument, options);
      }
export function useGetAvailableUpgradePipelineTemplateVersionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables>(GetAvailableUpgradePipelineTemplateVersionsDocument, options);
        }
export function useGetAvailableUpgradePipelineTemplateVersionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables>(GetAvailableUpgradePipelineTemplateVersionsDocument, options);
        }
export type GetAvailableUpgradePipelineTemplateVersionsQueryHookResult = ReturnType<typeof useGetAvailableUpgradePipelineTemplateVersionsQuery>;
export type GetAvailableUpgradePipelineTemplateVersionsLazyQueryHookResult = ReturnType<typeof useGetAvailableUpgradePipelineTemplateVersionsLazyQuery>;
export type GetAvailableUpgradePipelineTemplateVersionsSuspenseQueryHookResult = ReturnType<typeof useGetAvailableUpgradePipelineTemplateVersionsSuspenseQuery>;
export type GetAvailableUpgradePipelineTemplateVersionsQueryResult = Apollo.QueryResult<GetAvailableUpgradePipelineTemplateVersionsQuery, GetAvailableUpgradePipelineTemplateVersionsQueryVariables>;