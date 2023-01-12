import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type UpdateWorkspaceDescription_WorkspaceFragmentFragment = { __typename?: 'Workspace', id: string, description?: string | null };

export const UpdateWorkspaceDescription_WorkspaceFragmentFragmentDoc = gql`
    fragment UpdateWorkspaceDescription_WorkspaceFragment on Workspace {
  id
  description
}
    `;