import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type UpdateWorkspaceDescription_WorkspaceFragment = { __typename?: 'Workspace', id: any, description?: string | null };

export const UpdateWorkspaceDescription_WorkspaceFragmentDoc = gql`
    fragment UpdateWorkspaceDescription_workspace on Workspace {
  id
  description
}
    `;