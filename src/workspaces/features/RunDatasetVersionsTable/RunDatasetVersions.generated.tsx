import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type RunDatasetVersions_WorkspaceFragment = { __typename?: 'Workspace', slug: string };

export type RunDatasetVersionsTable_RunFragment = { __typename?: 'PipelineRun', datasetVersions: Array<{ __typename?: 'DatasetVersion', id: string, name: string, createdAt: any, dataset: { __typename?: 'Dataset', name: string, slug: string } }> };

export const RunDatasetVersions_WorkspaceFragmentDoc = gql`
    fragment RunDatasetVersions_workspace on Workspace {
  slug
}
    `;
export const RunDatasetVersionsTable_RunFragmentDoc = gql`
    fragment RunDatasetVersionsTable_run on PipelineRun {
  datasetVersions {
    id
    name
    createdAt
    dataset {
      name
      slug
    }
  }
}
    `;