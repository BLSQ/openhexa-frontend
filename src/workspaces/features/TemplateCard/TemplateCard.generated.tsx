import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
export type TemplateCard_TemplateFragment = { __typename?: 'PipelineTemplate', id: string, code: string, name: string, description?: string | null, currentVersion?: { __typename?: 'PipelineTemplateVersion', createdAt: any } | null };

export type TemplateCard_WorkspaceFragment = { __typename?: 'Workspace', slug: string };

export const TemplateCard_TemplateFragmentDoc = gql`
    fragment TemplateCard_template on PipelineTemplate {
  id
  code
  name
  description
  currentVersion {
    createdAt
  }
}
    `;
export const TemplateCard_WorkspaceFragmentDoc = gql`
    fragment TemplateCard_workspace on Workspace {
  slug
}
    `;