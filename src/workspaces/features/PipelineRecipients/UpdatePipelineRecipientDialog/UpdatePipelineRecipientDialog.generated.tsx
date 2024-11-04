import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
export type UpdatePipelineRecipient_PipelineRecipientFragment = { __typename?: 'PipelineRecipient', id: string, notificationEvent: Types.PipelineNotificationEvent };

export const UpdatePipelineRecipient_PipelineRecipientFragmentDoc = gql`
    fragment UpdatePipelineRecipient_PipelineRecipient on PipelineRecipient {
  id
  notificationEvent
}
    `;