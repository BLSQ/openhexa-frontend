import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type DownloadPipelineVersion_VersionFragment = { __typename?: 'PipelineVersion', id: string, number: number };

export type DownloadPipelineVersion_PipelineFragment = { __typename?: 'Pipeline', id: string, code: string };

export const DownloadPipelineVersion_VersionFragmentDoc = gql`
    fragment DownloadPipelineVersion_version on PipelineVersion {
  id
  number
}
    `;
export const DownloadPipelineVersion_PipelineFragmentDoc = gql`
    fragment DownloadPipelineVersion_pipeline on Pipeline {
  id
  code
}
    `;