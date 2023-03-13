import * as Types from '../../graphql-types';

import { gql } from '@apollo/client';
import { DeleteWorkspace_WorkspaceFragmentDoc } from '../features/DeleteWorkspaceDialog/DeleteWorkspaceDialog.generated';
import { InviteMemberWorkspace_WorkspaceFragmentDoc } from '../features/InviteMemberDialog/InviteMemberDialog.generated';
import { UpdateWorkspaceDescription_WorkspaceFragmentDoc } from '../features/UpdateDescriptionDialog/UpdateDescriptionDialog.generated';
import { WorkspaceLayout_WorkspaceFragmentDoc } from '../layouts/WorkspaceLayout/WorkspaceLayout.generated';
import { BucketExplorer_WorkspaceFragmentDoc, BucketExplorer_ObjectsFragmentDoc } from '../features/BucketExplorer/BucketExplorer.generated';
import { UploadObjectDialog_WorkspaceFragmentDoc } from '../features/UploadObjectDialog/UploadObjectDialog.generated';
import { CreateBucketFolderDialog_WorkspaceFragmentDoc } from '../features/CreateBucketFolderDialog/CreateBucketFolderDialog.generated';
import { CreateConnectionDialog_WorkspaceFragmentDoc } from '../features/CreateConnectionDialog/CreateConnectionDialog.generated';
import { ConnectionUsageSnippets_ConnectionFragmentDoc } from '../features/ConnectionUsageSnippets/ConnectionUsageSnippets.generated';
import { ConnectionFieldsSection_ConnectionFragmentDoc } from '../features/ConnectionFieldsSection/ConnectionFieldsSection.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WorkspacesPageQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type WorkspacesPageQuery = { __typename?: 'Query', workspaces: { __typename?: 'WorkspacePage', totalItems: number, items: Array<{ __typename?: 'Workspace', slug: string, name: string, countries: Array<{ __typename?: 'Country', code: string, flag: string }> }> } };

export type WorkspacePageQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;


export type WorkspacePageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, description?: string | null, countries: Array<{ __typename?: 'Country', code: string, flag: string, name: string }>, permissions: { __typename?: 'WorkspacePermissions', delete: boolean, update: boolean, manageMembers: boolean } } | null };

export type WorkspacePipelinesPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
}>;


export type WorkspacePipelinesPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspaceNotebooksPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
}>;


export type WorkspaceNotebooksPageQuery = { __typename?: 'Query', notebooksUrl: any, workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', update: boolean, manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspacePipelinePageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
}>;


export type WorkspacePipelinePageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspacePipelineStartPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
}>;


export type WorkspacePipelineStartPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspacePipelineRunPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
}>;


export type WorkspacePipelineRunPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspaceFilesPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
  page: Types.Scalars['Int'];
  perPage: Types.Scalars['Int'];
  prefix: Types.Scalars['String'];
}>;


export type WorkspaceFilesPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, bucket: { __typename?: 'Bucket', name: string, objects: { __typename?: 'BucketObjectPage', hasNextPage: boolean, hasPreviousPage: boolean, pageNumber: number, items: Array<{ __typename?: 'BucketObject', key: string, name: string, path: string, size?: number | null, updatedAt?: any | null, type: Types.BucketObjectType }> } }, permissions: { __typename?: 'WorkspacePermissions', createObject: boolean, deleteObject: boolean, manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspaceDatabasesPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type WorkspaceDatabasesPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', update: boolean, manageMembers: boolean }, database: { __typename?: 'Database', tables: { __typename?: 'DatabaseTablePage', totalPages: number, totalItems: number, items: Array<{ __typename?: 'DatabaseTable', name: string, count?: number | null }> } }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type WorkspaceDatabaseTablePageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
  tableName: Types.Scalars['String'];
}>;


export type WorkspaceDatabaseTablePageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, database: { __typename?: 'Database', table?: { __typename?: 'DatabaseTable', name: string, count?: number | null, columns: Array<{ __typename?: 'TableColumn', name: string, type: string }> } | null }, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type ConnectionsPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
}>;


export type ConnectionsPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', update: boolean, manageMembers: boolean }, connections: Array<{ __typename?: 'Connection', id: string, description?: string | null, name: string, type: Types.ConnectionType, slug: string, updatedAt?: any | null, permissions: { __typename?: 'ConnectionPermissions', update: boolean, delete: boolean } }>, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null };

export type ConnectionPageQueryVariables = Types.Exact<{
  workspaceSlug: Types.Scalars['String'];
  connectionId: Types.Scalars['UUID'];
}>;


export type ConnectionPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> } | null, connection?: { __typename?: 'Connection', id: string, name: string, slug: string, description?: string | null, type: Types.ConnectionType, createdAt: any, permissions: { __typename?: 'ConnectionPermissions', update: boolean, delete: boolean }, fields: Array<{ __typename?: 'ConnectionField', code: string, value?: string | null, secret: boolean }> } | null };


export const WorkspacesPageDocument = gql`
    query WorkspacesPage($page: Int, $perPage: Int) {
  workspaces(page: $page, perPage: $perPage) {
    totalItems
    items {
      slug
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
    query WorkspacePage($slug: String!) {
  workspace(slug: $slug) {
    slug
    name
    description
    countries {
      code
      flag
      name
    }
    permissions {
      delete
      update
      manageMembers
    }
    ...DeleteWorkspace_workspace
    ...InviteMemberWorkspace_workspace
    ...UpdateWorkspaceDescription_workspace
    ...WorkspaceLayout_workspace
  }
}
    ${DeleteWorkspace_WorkspaceFragmentDoc}
${InviteMemberWorkspace_WorkspaceFragmentDoc}
${UpdateWorkspaceDescription_WorkspaceFragmentDoc}
${WorkspaceLayout_WorkspaceFragmentDoc}`;

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
 *      slug: // value for 'slug'
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
export const WorkspacePipelinesPageDocument = gql`
    query WorkspacePipelinesPage($workspaceSlug: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspacePipelinesPageQuery__
 *
 * To run a query within a React component, call `useWorkspacePipelinesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacePipelinesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacePipelinesPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *   },
 * });
 */
export function useWorkspacePipelinesPageQuery(baseOptions: Apollo.QueryHookOptions<WorkspacePipelinesPageQuery, WorkspacePipelinesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacePipelinesPageQuery, WorkspacePipelinesPageQueryVariables>(WorkspacePipelinesPageDocument, options);
      }
export function useWorkspacePipelinesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacePipelinesPageQuery, WorkspacePipelinesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacePipelinesPageQuery, WorkspacePipelinesPageQueryVariables>(WorkspacePipelinesPageDocument, options);
        }
export type WorkspacePipelinesPageQueryHookResult = ReturnType<typeof useWorkspacePipelinesPageQuery>;
export type WorkspacePipelinesPageLazyQueryHookResult = ReturnType<typeof useWorkspacePipelinesPageLazyQuery>;
export type WorkspacePipelinesPageQueryResult = Apollo.QueryResult<WorkspacePipelinesPageQuery, WorkspacePipelinesPageQueryVariables>;
export const WorkspaceNotebooksPageDocument = gql`
    query WorkspaceNotebooksPage($workspaceSlug: String!) {
  notebooksUrl
  workspace(slug: $workspaceSlug) {
    slug
    permissions {
      update
    }
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspaceNotebooksPageQuery__
 *
 * To run a query within a React component, call `useWorkspaceNotebooksPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceNotebooksPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceNotebooksPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *   },
 * });
 */
export function useWorkspaceNotebooksPageQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceNotebooksPageQuery, WorkspaceNotebooksPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceNotebooksPageQuery, WorkspaceNotebooksPageQueryVariables>(WorkspaceNotebooksPageDocument, options);
      }
export function useWorkspaceNotebooksPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceNotebooksPageQuery, WorkspaceNotebooksPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceNotebooksPageQuery, WorkspaceNotebooksPageQueryVariables>(WorkspaceNotebooksPageDocument, options);
        }
export type WorkspaceNotebooksPageQueryHookResult = ReturnType<typeof useWorkspaceNotebooksPageQuery>;
export type WorkspaceNotebooksPageLazyQueryHookResult = ReturnType<typeof useWorkspaceNotebooksPageLazyQuery>;
export type WorkspaceNotebooksPageQueryResult = Apollo.QueryResult<WorkspaceNotebooksPageQuery, WorkspaceNotebooksPageQueryVariables>;
export const WorkspacePipelinePageDocument = gql`
    query WorkspacePipelinePage($workspaceSlug: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspacePipelinePageQuery__
 *
 * To run a query within a React component, call `useWorkspacePipelinePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacePipelinePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacePipelinePageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *   },
 * });
 */
export function useWorkspacePipelinePageQuery(baseOptions: Apollo.QueryHookOptions<WorkspacePipelinePageQuery, WorkspacePipelinePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacePipelinePageQuery, WorkspacePipelinePageQueryVariables>(WorkspacePipelinePageDocument, options);
      }
export function useWorkspacePipelinePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacePipelinePageQuery, WorkspacePipelinePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacePipelinePageQuery, WorkspacePipelinePageQueryVariables>(WorkspacePipelinePageDocument, options);
        }
export type WorkspacePipelinePageQueryHookResult = ReturnType<typeof useWorkspacePipelinePageQuery>;
export type WorkspacePipelinePageLazyQueryHookResult = ReturnType<typeof useWorkspacePipelinePageLazyQuery>;
export type WorkspacePipelinePageQueryResult = Apollo.QueryResult<WorkspacePipelinePageQuery, WorkspacePipelinePageQueryVariables>;
export const WorkspacePipelineStartPageDocument = gql`
    query WorkspacePipelineStartPage($workspaceSlug: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspacePipelineStartPageQuery__
 *
 * To run a query within a React component, call `useWorkspacePipelineStartPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacePipelineStartPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacePipelineStartPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *   },
 * });
 */
export function useWorkspacePipelineStartPageQuery(baseOptions: Apollo.QueryHookOptions<WorkspacePipelineStartPageQuery, WorkspacePipelineStartPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacePipelineStartPageQuery, WorkspacePipelineStartPageQueryVariables>(WorkspacePipelineStartPageDocument, options);
      }
export function useWorkspacePipelineStartPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacePipelineStartPageQuery, WorkspacePipelineStartPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacePipelineStartPageQuery, WorkspacePipelineStartPageQueryVariables>(WorkspacePipelineStartPageDocument, options);
        }
export type WorkspacePipelineStartPageQueryHookResult = ReturnType<typeof useWorkspacePipelineStartPageQuery>;
export type WorkspacePipelineStartPageLazyQueryHookResult = ReturnType<typeof useWorkspacePipelineStartPageLazyQuery>;
export type WorkspacePipelineStartPageQueryResult = Apollo.QueryResult<WorkspacePipelineStartPageQuery, WorkspacePipelineStartPageQueryVariables>;
export const WorkspacePipelineRunPageDocument = gql`
    query WorkspacePipelineRunPage($workspaceSlug: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspacePipelineRunPageQuery__
 *
 * To run a query within a React component, call `useWorkspacePipelineRunPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacePipelineRunPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacePipelineRunPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *   },
 * });
 */
export function useWorkspacePipelineRunPageQuery(baseOptions: Apollo.QueryHookOptions<WorkspacePipelineRunPageQuery, WorkspacePipelineRunPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacePipelineRunPageQuery, WorkspacePipelineRunPageQueryVariables>(WorkspacePipelineRunPageDocument, options);
      }
export function useWorkspacePipelineRunPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacePipelineRunPageQuery, WorkspacePipelineRunPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacePipelineRunPageQuery, WorkspacePipelineRunPageQueryVariables>(WorkspacePipelineRunPageDocument, options);
        }
export type WorkspacePipelineRunPageQueryHookResult = ReturnType<typeof useWorkspacePipelineRunPageQuery>;
export type WorkspacePipelineRunPageLazyQueryHookResult = ReturnType<typeof useWorkspacePipelineRunPageLazyQuery>;
export type WorkspacePipelineRunPageQueryResult = Apollo.QueryResult<WorkspacePipelineRunPageQuery, WorkspacePipelineRunPageQueryVariables>;
export const WorkspaceFilesPageDocument = gql`
    query WorkspaceFilesPage($workspaceSlug: String!, $page: Int!, $perPage: Int!, $prefix: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...BucketExplorer_workspace
    ...WorkspaceLayout_workspace
    ...UploadObjectDialog_workspace
    ...CreateBucketFolderDialog_workspace
    ...BucketExplorer_workspace
    bucket {
      objects(page: $page, prefix: $prefix, perPage: $perPage) {
        ...BucketExplorer_objects
      }
    }
  }
}
    ${BucketExplorer_WorkspaceFragmentDoc}
${WorkspaceLayout_WorkspaceFragmentDoc}
${UploadObjectDialog_WorkspaceFragmentDoc}
${CreateBucketFolderDialog_WorkspaceFragmentDoc}
${BucketExplorer_ObjectsFragmentDoc}`;

/**
 * __useWorkspaceFilesPageQuery__
 *
 * To run a query within a React component, call `useWorkspaceFilesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceFilesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceFilesPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      prefix: // value for 'prefix'
 *   },
 * });
 */
export function useWorkspaceFilesPageQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceFilesPageQuery, WorkspaceFilesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceFilesPageQuery, WorkspaceFilesPageQueryVariables>(WorkspaceFilesPageDocument, options);
      }
export function useWorkspaceFilesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceFilesPageQuery, WorkspaceFilesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceFilesPageQuery, WorkspaceFilesPageQueryVariables>(WorkspaceFilesPageDocument, options);
        }
export type WorkspaceFilesPageQueryHookResult = ReturnType<typeof useWorkspaceFilesPageQuery>;
export type WorkspaceFilesPageLazyQueryHookResult = ReturnType<typeof useWorkspaceFilesPageLazyQuery>;
export type WorkspaceFilesPageQueryResult = Apollo.QueryResult<WorkspaceFilesPageQuery, WorkspaceFilesPageQueryVariables>;
export const WorkspaceDatabasesPageDocument = gql`
    query WorkspaceDatabasesPage($workspaceSlug: String!, $page: Int, $perPage: Int) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    permissions {
      update
    }
    database {
      tables(page: $page, perPage: $perPage) {
        totalPages
        totalItems
        items {
          name
          count
        }
      }
    }
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspaceDatabasesPageQuery__
 *
 * To run a query within a React component, call `useWorkspaceDatabasesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceDatabasesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceDatabasesPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useWorkspaceDatabasesPageQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceDatabasesPageQuery, WorkspaceDatabasesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceDatabasesPageQuery, WorkspaceDatabasesPageQueryVariables>(WorkspaceDatabasesPageDocument, options);
      }
export function useWorkspaceDatabasesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceDatabasesPageQuery, WorkspaceDatabasesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceDatabasesPageQuery, WorkspaceDatabasesPageQueryVariables>(WorkspaceDatabasesPageDocument, options);
        }
export type WorkspaceDatabasesPageQueryHookResult = ReturnType<typeof useWorkspaceDatabasesPageQuery>;
export type WorkspaceDatabasesPageLazyQueryHookResult = ReturnType<typeof useWorkspaceDatabasesPageLazyQuery>;
export type WorkspaceDatabasesPageQueryResult = Apollo.QueryResult<WorkspaceDatabasesPageQuery, WorkspaceDatabasesPageQueryVariables>;
export const WorkspaceDatabaseTablePageDocument = gql`
    query WorkspaceDatabaseTablePage($workspaceSlug: String!, $tableName: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    database {
      table(name: $tableName) {
        name
        count
        columns {
          name
          type
        }
      }
    }
    ...WorkspaceLayout_workspace
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useWorkspaceDatabaseTablePageQuery__
 *
 * To run a query within a React component, call `useWorkspaceDatabaseTablePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceDatabaseTablePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceDatabaseTablePageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *      tableName: // value for 'tableName'
 *   },
 * });
 */
export function useWorkspaceDatabaseTablePageQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceDatabaseTablePageQuery, WorkspaceDatabaseTablePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceDatabaseTablePageQuery, WorkspaceDatabaseTablePageQueryVariables>(WorkspaceDatabaseTablePageDocument, options);
      }
export function useWorkspaceDatabaseTablePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceDatabaseTablePageQuery, WorkspaceDatabaseTablePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceDatabaseTablePageQuery, WorkspaceDatabaseTablePageQueryVariables>(WorkspaceDatabaseTablePageDocument, options);
        }
export type WorkspaceDatabaseTablePageQueryHookResult = ReturnType<typeof useWorkspaceDatabaseTablePageQuery>;
export type WorkspaceDatabaseTablePageLazyQueryHookResult = ReturnType<typeof useWorkspaceDatabaseTablePageLazyQuery>;
export type WorkspaceDatabaseTablePageQueryResult = Apollo.QueryResult<WorkspaceDatabaseTablePageQuery, WorkspaceDatabaseTablePageQueryVariables>;
export const ConnectionsPageDocument = gql`
    query ConnectionsPage($workspaceSlug: String!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    permissions {
      update
    }
    ...CreateConnectionDialog_workspace
    connections {
      id
      description
      name
      type
      slug
      updatedAt
      permissions {
        update
        delete
      }
    }
    ...WorkspaceLayout_workspace
  }
}
    ${CreateConnectionDialog_WorkspaceFragmentDoc}
${WorkspaceLayout_WorkspaceFragmentDoc}`;

/**
 * __useConnectionsPageQuery__
 *
 * To run a query within a React component, call `useConnectionsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useConnectionsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConnectionsPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *   },
 * });
 */
export function useConnectionsPageQuery(baseOptions: Apollo.QueryHookOptions<ConnectionsPageQuery, ConnectionsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConnectionsPageQuery, ConnectionsPageQueryVariables>(ConnectionsPageDocument, options);
      }
export function useConnectionsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConnectionsPageQuery, ConnectionsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConnectionsPageQuery, ConnectionsPageQueryVariables>(ConnectionsPageDocument, options);
        }
export type ConnectionsPageQueryHookResult = ReturnType<typeof useConnectionsPageQuery>;
export type ConnectionsPageLazyQueryHookResult = ReturnType<typeof useConnectionsPageLazyQuery>;
export type ConnectionsPageQueryResult = Apollo.QueryResult<ConnectionsPageQuery, ConnectionsPageQueryVariables>;
export const ConnectionPageDocument = gql`
    query ConnectionPage($workspaceSlug: String!, $connectionId: UUID!) {
  workspace(slug: $workspaceSlug) {
    slug
    name
    ...WorkspaceLayout_workspace
  }
  connection(id: $connectionId) {
    id
    name
    slug
    description
    type
    createdAt
    permissions {
      update
      delete
    }
    ...ConnectionUsageSnippets_connection
    ...ConnectionFieldsSection_connection
  }
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}
${ConnectionUsageSnippets_ConnectionFragmentDoc}
${ConnectionFieldsSection_ConnectionFragmentDoc}`;

/**
 * __useConnectionPageQuery__
 *
 * To run a query within a React component, call `useConnectionPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useConnectionPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConnectionPageQuery({
 *   variables: {
 *      workspaceSlug: // value for 'workspaceSlug'
 *      connectionId: // value for 'connectionId'
 *   },
 * });
 */
export function useConnectionPageQuery(baseOptions: Apollo.QueryHookOptions<ConnectionPageQuery, ConnectionPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConnectionPageQuery, ConnectionPageQueryVariables>(ConnectionPageDocument, options);
      }
export function useConnectionPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConnectionPageQuery, ConnectionPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConnectionPageQuery, ConnectionPageQueryVariables>(ConnectionPageDocument, options);
        }
export type ConnectionPageQueryHookResult = ReturnType<typeof useConnectionPageQuery>;
export type ConnectionPageLazyQueryHookResult = ReturnType<typeof useConnectionPageLazyQuery>;
export type ConnectionPageQueryResult = Apollo.QueryResult<ConnectionPageQuery, ConnectionPageQueryVariables>;