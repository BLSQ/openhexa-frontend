import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
export type DeletePipelineRecipientTrigger_RecipientFragment = { __typename?: 'PipelineRecipient', id: string, user: { __typename?: 'User', displayName: string }, pipeline: { __typename?: 'Pipeline', id: string, permissions: { __typename?: 'PipelinePermissions', update: boolean } } };

export const DeletePipelineRecipientTrigger_RecipientFragmentDoc = gql`
    fragment DeletePipelineRecipientTrigger_recipient on PipelineRecipient {
  id
  user {
    displayName
  }
  pipeline {
    id
    permissions {
      update
    }
  }
}
    `;