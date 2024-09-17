import * as Types from '../../../../graphql/types';

import { gql } from '@apollo/client';
export type DatasetFileMetadata_FileFragment = { __typename?: 'DatasetVersionFile', metadata: { __typename?: 'MetadataObject', attributes: Array<{ __typename?: 'MetadataAttribute', id: string, key: string, value?: any | null }> } };

export const DatasetFileMetadata_FileFragmentDoc = gql`
    fragment DatasetFileMetadata_file on DatasetVersionFile {
  metadata {
    attributes {
      id
      key
      value
    }
  }
}
    `;