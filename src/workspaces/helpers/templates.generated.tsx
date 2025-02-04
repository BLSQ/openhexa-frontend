import * as Types from '../../graphql/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateWorkspaceTemplateMutationVariables = Types.Exact<{
  input: Types.UpdateTemplateInput;
}>;


export type UpdateWorkspaceTemplateMutation = { __typename?: 'Mutation', updatePipelineTemplate: { __typename?: 'UpdateTemplateResult', success: boolean, errors: Array<Types.UpdateTemplateError>, template?: { __typename?: 'PipelineTemplate', id: string, name: string, description?: string | null, config?: string | null } | null } };


export const UpdateWorkspaceTemplateDocument = gql`
    mutation UpdateWorkspaceTemplate($input: UpdateTemplateInput!) {
  updatePipelineTemplate(input: $input) {
    success
    errors
    template {
      id
      name
      description
      config
    }
  }
}
    `;
export type UpdateWorkspaceTemplateMutationFn = Apollo.MutationFunction<UpdateWorkspaceTemplateMutation, UpdateWorkspaceTemplateMutationVariables>;

/**
 * __useUpdateWorkspaceTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateWorkspaceTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkspaceTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkspaceTemplateMutation, { data, loading, error }] = useUpdateWorkspaceTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateWorkspaceTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkspaceTemplateMutation, UpdateWorkspaceTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkspaceTemplateMutation, UpdateWorkspaceTemplateMutationVariables>(UpdateWorkspaceTemplateDocument, options);
      }
export type UpdateWorkspaceTemplateMutationHookResult = ReturnType<typeof useUpdateWorkspaceTemplateMutation>;
export type UpdateWorkspaceTemplateMutationResult = Apollo.MutationResult<UpdateWorkspaceTemplateMutation>;
export type UpdateWorkspaceTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateWorkspaceTemplateMutation, UpdateWorkspaceTemplateMutationVariables>;