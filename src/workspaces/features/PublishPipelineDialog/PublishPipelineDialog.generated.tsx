import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
export type PipelinePublish_PipelineFragment = { __typename?: 'Pipeline', template?: { __typename?: 'Template', name: string } | null };

export type PipelinePublish_WorkspaceFragment = { __typename?: 'Workspace', slug: string };

export const PipelinePublish_PipelineFragmentDoc = gql`
    fragment PipelinePublish_pipeline on Pipeline {
  template {
    name
  }
}
    `;
export const PipelinePublish_WorkspaceFragmentDoc = gql`
    fragment PipelinePublish_workspace on Workspace {
  slug
}
    `;