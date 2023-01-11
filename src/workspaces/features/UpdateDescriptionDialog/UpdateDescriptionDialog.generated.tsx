import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type WorkspaceDescription_WorkspaceFragment = { __typename?: 'Workspace', id: string, description?: string | null };

export const WorkspaceDescription_WorkspaceFragmentDoc = gql`
    fragment WorkspaceDescription_workspace on Workspace {
  id
  description
}
    `;