import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import { WorkspaceLayout_WorkspaceFragmentDoc } from '../WorkspaceLayout/WorkspaceLayout.generated';
export type BaseLayout_WorkspaceFragment = { __typename?: 'Workspace', name: string, slug: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean, update: boolean, launchNotebookServer: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> };

export const BaseLayout_WorkspaceFragmentDoc = gql`
    fragment BaseLayout_workspace on Workspace {
  ...WorkspaceLayout_workspace
  name
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;