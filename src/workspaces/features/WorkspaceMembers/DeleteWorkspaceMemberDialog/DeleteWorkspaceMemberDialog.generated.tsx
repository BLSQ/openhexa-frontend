import * as Types from '../../../../graphql-types';

import { gql } from '@apollo/client';
export type DeleteWorkspaceMember_WorkspaceMemberFragment = { __typename?: 'WorkspaceMembership', id: any, user: { __typename?: 'User', id: any, displayName: string } };

export const DeleteWorkspaceMember_WorkspaceMemberFragmentDoc = gql`
    fragment DeleteWorkspaceMember_workspaceMember on WorkspaceMembership {
  id
  user {
    id
    displayName
  }
}
    `;