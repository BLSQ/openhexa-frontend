import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ObjectPickerQueryVariables = Types.Exact<{
  slug: Types.Scalars['String']['input'];
  query: Types.Scalars['String']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  ignoreHiddenFiles?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  ignoreDelimiter?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type ObjectPickerQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, bucket: { __typename?: 'Bucket', objects: { __typename?: 'BucketObjectPage', hasNextPage: boolean, items: Array<{ __typename?: 'BucketObject', name: string, key: string, path: string }> } } } | null };


export const ObjectPickerDocument = gql`
    query ObjectPicker($slug: String!, $query: String!, $page: Int, $ignoreHiddenFiles: Boolean, $ignoreDelimiter: Boolean) {
  workspace(slug: $slug) {
    slug
    bucket {
      objects(
        query: $query
        page: $page
        ignoreHiddenFiles: $ignoreHiddenFiles
        ignoreDelimiter: $ignoreDelimiter
      ) {
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
 * __useObjectPickerQuery__
 *
 * To run a query within a React component, call `useObjectPickerQuery` and pass it any options that fit your needs.
 * When your component renders, `useObjectPickerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useObjectPickerQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      query: // value for 'query'
 *      page: // value for 'page'
 *      ignoreHiddenFiles: // value for 'ignoreHiddenFiles'
 *      ignoreDelimiter: // value for 'ignoreDelimiter'
 *   },
 * });
 */
export function useObjectPickerQuery(baseOptions: Apollo.QueryHookOptions<ObjectPickerQuery, ObjectPickerQueryVariables> & ({ variables: ObjectPickerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ObjectPickerQuery, ObjectPickerQueryVariables>(ObjectPickerDocument, options);
      }
export function useObjectPickerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ObjectPickerQuery, ObjectPickerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ObjectPickerQuery, ObjectPickerQueryVariables>(ObjectPickerDocument, options);
        }
export function useObjectPickerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ObjectPickerQuery, ObjectPickerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ObjectPickerQuery, ObjectPickerQueryVariables>(ObjectPickerDocument, options);
        }
export type ObjectPickerQueryHookResult = ReturnType<typeof useObjectPickerQuery>;
export type ObjectPickerLazyQueryHookResult = ReturnType<typeof useObjectPickerLazyQuery>;
export type ObjectPickerSuspenseQueryHookResult = ReturnType<typeof useObjectPickerSuspenseQuery>;
export type ObjectPickerQueryResult = Apollo.QueryResult<ObjectPickerQuery, ObjectPickerQueryVariables>;