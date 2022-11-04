import * as Types from '../../graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NoteBooksPageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NoteBooksPageQuery = { __typename?: 'Query', notebooksUrl: any };


export const NoteBooksPageDocument = gql`
    query noteBooksPage {
  notebooksUrl
}
    `;

/**
 * __useNoteBooksPageQuery__
 *
 * To run a query within a React component, call `useNoteBooksPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useNoteBooksPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNoteBooksPageQuery({
 *   variables: {
 *   },
 * });
 */
export function useNoteBooksPageQuery(baseOptions?: Apollo.QueryHookOptions<NoteBooksPageQuery, NoteBooksPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NoteBooksPageQuery, NoteBooksPageQueryVariables>(NoteBooksPageDocument, options);
      }
export function useNoteBooksPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NoteBooksPageQuery, NoteBooksPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NoteBooksPageQuery, NoteBooksPageQueryVariables>(NoteBooksPageDocument, options);
        }
export type NoteBooksPageQueryHookResult = ReturnType<typeof useNoteBooksPageQuery>;
export type NoteBooksPageLazyQueryHookResult = ReturnType<typeof useNoteBooksPageLazyQuery>;
export type NoteBooksPageQueryResult = Apollo.QueryResult<NoteBooksPageQuery, NoteBooksPageQueryVariables>;