import * as Types from '../../graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateWorkspaceMutationVariables = Types.Exact<{
  input: Types.CreateWorkspaceInput;
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace: { __typename?: 'CreateWorkspaceResult', success: boolean, errors: Array<Types.CreateWorkspaceError>, workspace?: { __typename?: 'Workspace', id: string, name: string, description?: string | null, countries: Array<{ __typename?: 'Country', code: string, alpha3: string, name: string }> } | null } };

export type UpdateWorkspaceMutationVariables = Types.Exact<{
  input: Types.UpdateWorkspaceInput;
}>;


export type UpdateWorkspaceMutation = { __typename?: 'Mutation', updateWorkspace: { __typename?: 'UpdateWorkspaceResult', success: boolean, errors: Array<Types.UpdateWorkspaceError>, workspace?: { __typename?: 'Workspace', id: string, name: string, description?: string | null, countries: Array<{ __typename?: 'Country', code: string, alpha3: string, name: string }> } | null } };

export type DeleteWorkspaceMutationVariables = Types.Exact<{
  input: Types.DeleteWorkspaceInput;
}>;


export type DeleteWorkspaceMutation = { __typename?: 'Mutation', deleteWorkspace: { __typename?: 'DeleteWorkspaceResult', success: boolean, errors: Array<Types.DeleteWorkspaceError> } };

export type CreateWorkspaceMemberMutationVariables = Types.Exact<{
  input: Types.CreateWorkspaceMemberInput;
}>;


export type CreateWorkspaceMemberMutation = { __typename?: 'Mutation', createWorkspaceMember: { __typename?: 'CreateWorkspaceMemberResult', success: boolean, errors: Array<Types.CreateWorkspaceMembershipError>, workspaceMembership?: { __typename?: 'WorkspaceMembership', id: string } | null } };


export const CreateWorkspaceDocument = gql`
    mutation createWorkspace($input: CreateWorkspaceInput!) {
  createWorkspace(input: $input) {
    success
    workspace {
      id
      name
      description
      countries {
        code
        alpha3
        name
      }
    }
    errors
  }
}
    `;
export type CreateWorkspaceMutationFn = Apollo.MutationFunction<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;

/**
 * __useCreateWorkspaceMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceMutation, { data, loading, error }] = useCreateWorkspaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>(CreateWorkspaceDocument, options);
      }
export type CreateWorkspaceMutationHookResult = ReturnType<typeof useCreateWorkspaceMutation>;
export type CreateWorkspaceMutationResult = Apollo.MutationResult<CreateWorkspaceMutation>;
export type CreateWorkspaceMutationOptions = Apollo.BaseMutationOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const UpdateWorkspaceDocument = gql`
    mutation updateWorkspace($input: UpdateWorkspaceInput!) {
  updateWorkspace(input: $input) {
    success
    workspace {
      id
      name
      description
      countries {
        code
        alpha3
        name
      }
    }
    errors
  }
}
    `;
export type UpdateWorkspaceMutationFn = Apollo.MutationFunction<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>;

/**
 * __useUpdateWorkspaceMutation__
 *
 * To run a mutation, you first call `useUpdateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkspaceMutation, { data, loading, error }] = useUpdateWorkspaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>(UpdateWorkspaceDocument, options);
      }
export type UpdateWorkspaceMutationHookResult = ReturnType<typeof useUpdateWorkspaceMutation>;
export type UpdateWorkspaceMutationResult = Apollo.MutationResult<UpdateWorkspaceMutation>;
export type UpdateWorkspaceMutationOptions = Apollo.BaseMutationOptions<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>;
export const DeleteWorkspaceDocument = gql`
    mutation deleteWorkspace($input: DeleteWorkspaceInput!) {
  deleteWorkspace(input: $input) {
    success
    errors
  }
}
    `;
export type DeleteWorkspaceMutationFn = Apollo.MutationFunction<DeleteWorkspaceMutation, DeleteWorkspaceMutationVariables>;

/**
 * __useDeleteWorkspaceMutation__
 *
 * To run a mutation, you first call `useDeleteWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWorkspaceMutation, { data, loading, error }] = useDeleteWorkspaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWorkspaceMutation, DeleteWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWorkspaceMutation, DeleteWorkspaceMutationVariables>(DeleteWorkspaceDocument, options);
      }
export type DeleteWorkspaceMutationHookResult = ReturnType<typeof useDeleteWorkspaceMutation>;
export type DeleteWorkspaceMutationResult = Apollo.MutationResult<DeleteWorkspaceMutation>;
export type DeleteWorkspaceMutationOptions = Apollo.BaseMutationOptions<DeleteWorkspaceMutation, DeleteWorkspaceMutationVariables>;
export const CreateWorkspaceMemberDocument = gql`
    mutation createWorkspaceMember($input: CreateWorkspaceMemberInput!) {
  createWorkspaceMember(input: $input) {
    success
    errors
    workspaceMembership {
      id
    }
  }
}
    `;
export type CreateWorkspaceMemberMutationFn = Apollo.MutationFunction<CreateWorkspaceMemberMutation, CreateWorkspaceMemberMutationVariables>;

/**
 * __useCreateWorkspaceMemberMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceMemberMutation, { data, loading, error }] = useCreateWorkspaceMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWorkspaceMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkspaceMemberMutation, CreateWorkspaceMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWorkspaceMemberMutation, CreateWorkspaceMemberMutationVariables>(CreateWorkspaceMemberDocument, options);
      }
export type CreateWorkspaceMemberMutationHookResult = ReturnType<typeof useCreateWorkspaceMemberMutation>;
export type CreateWorkspaceMemberMutationResult = Apollo.MutationResult<CreateWorkspaceMemberMutation>;
export type CreateWorkspaceMemberMutationOptions = Apollo.BaseMutationOptions<CreateWorkspaceMemberMutation, CreateWorkspaceMemberMutationVariables>;