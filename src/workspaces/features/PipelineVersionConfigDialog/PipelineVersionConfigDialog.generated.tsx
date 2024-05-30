import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import { ParameterField_ParameterFragmentDoc } from '../RunPipelineDialog/ParameterField.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdatePipelineVersionConfigMutationVariables = Types.Exact<{
  input: Types.UpdatePipelineVersionInput;
}>;


export type UpdatePipelineVersionConfigMutation = { __typename?: 'Mutation', updatePipelineVersion: { __typename?: 'UpdatePipelineVersionResult', success: boolean, errors: Array<Types.UpdatePipelineVersionError>, pipelineVersion?: { __typename?: 'PipelineVersion', id: string, name: string, description?: string | null, externalLink?: any | null, isLatestVersion: boolean, createdAt: any, config?: any | null, parameters: Array<{ __typename?: 'PipelineParameter', code: string, name: string, help?: string | null, type: string, default?: any | null, required: boolean, choices?: Array<any> | null, multiple: boolean }> } | null } };

export type PipelineVersionConfig_UpdateFragment = { __typename?: 'PipelineVersion', id: string, name: string, description?: string | null, externalLink?: any | null, isLatestVersion: boolean, createdAt: any, config?: any | null, parameters: Array<{ __typename?: 'PipelineParameter', code: string, name: string, help?: string | null, type: string, default?: any | null, required: boolean, choices?: Array<any> | null, multiple: boolean }> };

export const PipelineVersionConfig_UpdateFragmentDoc = gql`
    fragment PipelineVersionConfig_update on PipelineVersion {
  id
  name
  description
  externalLink
  isLatestVersion
  createdAt
  config
  parameters {
    ...ParameterField_parameter
  }
}
    ${ParameterField_ParameterFragmentDoc}`;
export const UpdatePipelineVersionConfigDocument = gql`
    mutation UpdatePipelineVersionConfig($input: UpdatePipelineVersionInput!) {
  updatePipelineVersion(input: $input) {
    success
    errors
    pipelineVersion {
      id
      name
      description
      externalLink
      isLatestVersion
      createdAt
      config
      parameters {
        ...ParameterField_parameter
      }
    }
  }
}
    ${ParameterField_ParameterFragmentDoc}`;
export type UpdatePipelineVersionConfigMutationFn = Apollo.MutationFunction<UpdatePipelineVersionConfigMutation, UpdatePipelineVersionConfigMutationVariables>;

/**
 * __useUpdatePipelineVersionConfigMutation__
 *
 * To run a mutation, you first call `useUpdatePipelineVersionConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePipelineVersionConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePipelineVersionConfigMutation, { data, loading, error }] = useUpdatePipelineVersionConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePipelineVersionConfigMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePipelineVersionConfigMutation, UpdatePipelineVersionConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePipelineVersionConfigMutation, UpdatePipelineVersionConfigMutationVariables>(UpdatePipelineVersionConfigDocument, options);
      }
export type UpdatePipelineVersionConfigMutationHookResult = ReturnType<typeof useUpdatePipelineVersionConfigMutation>;
export type UpdatePipelineVersionConfigMutationResult = Apollo.MutationResult<UpdatePipelineVersionConfigMutation>;
export type UpdatePipelineVersionConfigMutationOptions = Apollo.BaseMutationOptions<UpdatePipelineVersionConfigMutation, UpdatePipelineVersionConfigMutationVariables>;