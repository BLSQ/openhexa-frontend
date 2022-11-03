import * as Types from '../../graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NotebooksUrlQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NotebooksUrlQuery = { __typename?: 'Query', notebooksUrl: any };


export const NotebooksUrlDocument = gql`
    query notebooksUrl {
  notebooksUrl
}
    `;

/**
 * __useNotebooksUrlQuery__
 *
 * To run a query within a React component, call `useNotebooksUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotebooksUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotebooksUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotebooksUrlQuery(baseOptions?: Apollo.QueryHookOptions<NotebooksUrlQuery, NotebooksUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotebooksUrlQuery, NotebooksUrlQueryVariables>(NotebooksUrlDocument, options);
      }
export function useNotebooksUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotebooksUrlQuery, NotebooksUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotebooksUrlQuery, NotebooksUrlQueryVariables>(NotebooksUrlDocument, options);
        }
export type NotebooksUrlQueryHookResult = ReturnType<typeof useNotebooksUrlQuery>;
export type NotebooksUrlLazyQueryHookResult = ReturnType<typeof useNotebooksUrlLazyQuery>;
export type NotebooksUrlQueryResult = Apollo.QueryResult<NotebooksUrlQuery, NotebooksUrlQueryVariables>;