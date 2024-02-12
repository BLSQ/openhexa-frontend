import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type PipelineVersionCard_VersionFragment = { __typename?: 'PipelineVersion', id: string, number: number, parameters: Array<{ __typename?: 'PipelineParameter', code: string, name: string, type: string, multiple: boolean, required: boolean, help?: string | null }>, pipeline: { __typename?: 'Pipeline', id: string, code: string } };

export const PipelineVersionCard_VersionFragmentDoc = gql`
    fragment PipelineVersionCard_version on PipelineVersion {
  id
  number
  parameters {
    code
    name
    type
    multiple
    required
    help
  }
  pipeline {
    id
    code
  }
}
    `;