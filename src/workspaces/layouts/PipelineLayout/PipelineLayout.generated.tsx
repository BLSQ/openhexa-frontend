import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import { WorkspaceLayout_WorkspaceFragmentDoc } from '../WorkspaceLayout/WorkspaceLayout.generated';
import { PipelineVersionPicker_VersionFragmentDoc } from '../../features/PipelineVersionPicker/PipelineVersionPicker.generated';
import { DownloadPipelineVersion_VersionFragmentDoc } from '../../../pipelines/features/DownloadPipelineVersion/DownloadPipelineVersion.generated';
import { RunPipelineDialog_PipelineFragmentDoc, RunPipelineDialog_RunFragmentDoc } from '../../features/RunPipelineDialog/RunPipelineDialog.generated';
export type PipelineLayout_WorkspaceFragment = { __typename?: 'Workspace', slug: string, name: string, permissions: { __typename?: 'WorkspacePermissions', manageMembers: boolean, update: boolean, launchNotebookServer: boolean }, countries: Array<{ __typename?: 'Country', flag: string, code: string }> };

export type PipelineLayout_PipelineFragment = { __typename?: 'Pipeline', id: string, code: string, name?: string | null, type: Types.PipelineType, permissions: { __typename?: 'PipelinePermissions', run: boolean, delete: boolean, update: boolean }, currentVersion?: { __typename?: 'PipelineVersion', id: string, name: string, description?: string | null, config?: any | null, externalLink?: any | null, createdAt: any, parameters: Array<{ __typename?: 'PipelineParameter', code: string, name: string, help?: string | null, type: Types.ParameterType, default?: any | null, required: boolean, choices?: Array<any> | null, multiple: boolean }>, user?: { __typename?: 'User', displayName: string } | null, pipeline: { __typename?: 'Pipeline', id: string, code: string } } | null, workspace: { __typename?: 'Workspace', slug: string } };

export const PipelineLayout_WorkspaceFragmentDoc = gql`
    fragment PipelineLayout_workspace on Workspace {
  ...WorkspaceLayout_workspace
}
    ${WorkspaceLayout_WorkspaceFragmentDoc}`;
export const PipelineLayout_PipelineFragmentDoc = gql`
    fragment PipelineLayout_pipeline on Pipeline {
  id
  code
  name
  permissions {
    run
    delete
    update
  }
  currentVersion {
    id
    name
    description
    config
    externalLink
    ...PipelineVersionPicker_version
    ...DownloadPipelineVersion_version
  }
  ...RunPipelineDialog_pipeline
}
    ${PipelineVersionPicker_VersionFragmentDoc}
${DownloadPipelineVersion_VersionFragmentDoc}
${RunPipelineDialog_PipelineFragmentDoc}`;