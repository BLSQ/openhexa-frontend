import * as Types from '../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdatePipelineMutationVariables = Types.Exact<{
  input: Types.UpdateDagInput;
}>;


export type UpdatePipelineMutation = { __typename?: 'Mutation', updateDAG: { __typename?: 'UpdateDAGResult', success: boolean, errors: Array<Types.UpdateDagError>, dag?: { __typename?: 'DAG', id: string, label: string, description?: string | null, schedule?: string | null } | null } };

export type CreatePipelineTemplateVersionMutationVariables = Types.Exact<{
  input: Types.CreatePipelineTemplateVersionInput;
}>;


export type CreatePipelineTemplateVersionMutation = { __typename?: 'Mutation', createPipelineTemplateVersion: { __typename?: 'CreatePipelineTemplateVersionResult', success: boolean, errors?: Array<Types.CreatePipelineTemplateVersionError> | null, pipelineTemplate?: { __typename?: 'PipelineTemplate', name: string, code: string, versions?: Array<{ __typename?: 'PipelineTemplateVersion', versionNumber: number }> | null } | null } };


export const UpdatePipelineDocument = gql`
    mutation UpdatePipeline($input: UpdateDAGInput!) {
  updateDAG(input: $input) {
    success
    errors
    dag {
      id
      label
      description
      schedule
    }
  }
}
    `;
export type UpdatePipelineMutationFn = Apollo.MutationFunction<UpdatePipelineMutation, UpdatePipelineMutationVariables>;

/**
 * __useUpdatePipelineMutation__
 *
 * To run a mutation, you first call `useUpdatePipelineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePipelineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePipelineMutation, { data, loading, error }] = useUpdatePipelineMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePipelineMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePipelineMutation, UpdatePipelineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePipelineMutation, UpdatePipelineMutationVariables>(UpdatePipelineDocument, options);
      }
export type UpdatePipelineMutationHookResult = ReturnType<typeof useUpdatePipelineMutation>;
export type UpdatePipelineMutationResult = Apollo.MutationResult<UpdatePipelineMutation>;
export type UpdatePipelineMutationOptions = Apollo.BaseMutationOptions<UpdatePipelineMutation, UpdatePipelineMutationVariables>;
export const CreatePipelineTemplateVersionDocument = gql`
    mutation CreatePipelineTemplateVersion($input: CreatePipelineTemplateVersionInput!) {
  createPipelineTemplateVersion(input: $input) {
    success
    errors
    pipelineTemplate {
      name
      code
      versions {
        versionNumber
      }
    }
  }
}
    `;
export type CreatePipelineTemplateVersionMutationFn = Apollo.MutationFunction<CreatePipelineTemplateVersionMutation, CreatePipelineTemplateVersionMutationVariables>;

/**
 * __useCreatePipelineTemplateVersionMutation__
 *
 * To run a mutation, you first call `useCreatePipelineTemplateVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePipelineTemplateVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPipelineTemplateVersionMutation, { data, loading, error }] = useCreatePipelineTemplateVersionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePipelineTemplateVersionMutation(baseOptions?: Apollo.MutationHookOptions<CreatePipelineTemplateVersionMutation, CreatePipelineTemplateVersionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePipelineTemplateVersionMutation, CreatePipelineTemplateVersionMutationVariables>(CreatePipelineTemplateVersionDocument, options);
      }
export type CreatePipelineTemplateVersionMutationHookResult = ReturnType<typeof useCreatePipelineTemplateVersionMutation>;
export type CreatePipelineTemplateVersionMutationResult = Apollo.MutationResult<CreatePipelineTemplateVersionMutation>;
export type CreatePipelineTemplateVersionMutationOptions = Apollo.BaseMutationOptions<CreatePipelineTemplateVersionMutation, CreatePipelineTemplateVersionMutationVariables>;