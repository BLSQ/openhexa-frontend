import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
export type DatasetFileSummary_FileFragment = { __typename?: 'DatasetVersionFile', id: string, filename: string, contentType: string, createdAt: any };

export const DatasetFileSummary_FileFragmentDoc = gql`
    fragment DatasetFileSummary_file on DatasetVersionFile {
  id
  filename
  contentType
  createdAt
}
    `;