import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import { DeletePipelineRecipientTrigger_RecipientFragmentDoc } from './DeletePipelineRecipientTrigger/DeletePipelineRecipientTrigger.generated';
export type PipelineRecipients_PipelineFragment = { __typename?: 'Pipeline', id: string, permissions: { __typename?: 'PipelinePermissions', update: boolean }, recipients: Array<{ __typename?: 'PipelineRecipient', id: string, notificationEvent: Types.PipelineNotificationEvent, user: { __typename?: 'User', displayName: string }, pipeline: { __typename?: 'Pipeline', id: string, permissions: { __typename?: 'PipelinePermissions', update: boolean } } }>, workspace: { __typename?: 'Workspace', slug: string } };

export const PipelineRecipients_PipelineFragmentDoc = gql`
    fragment PipelineRecipients_pipeline on Pipeline {
  id
  permissions {
    update
  }
  recipients {
    id
    user {
      displayName
    }
    notificationEvent
    ...DeletePipelineRecipientTrigger_recipient
  }
  workspace {
    slug
  }
}
    ${DeletePipelineRecipientTrigger_RecipientFragmentDoc}`;