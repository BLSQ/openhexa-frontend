import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import { DatasetFileSummary_FileFragmentDoc } from './DatasetFileSummary/DatasetFileSummary.generated';
import { DatasetFileDataGrid_FileFragmentDoc } from './DatasetFileDataGrid/DatasetFileDataGrid.generated';
import { DatasetFileMetadata_FileFragmentDoc } from './DatasetFileMetadata/DatasetFileMetadata.generated';
import { DatasetFilesExplorer_VersionFragmentDoc } from './DatasetFilesExplorer/DatasetFilesExplorer.generated';
export type DatasetExplorerFile_FileFragment = { __typename?: 'DatasetVersionFile', id: string, filename: string, contentType: string, createdAt: any, fileSample?: { __typename?: 'DatasetFileSample', sample?: any | null, status: Types.FileSampleStatus } | null, metadata: { __typename?: 'MetadataObject', attributes: Array<{ __typename?: 'MetadataAttribute', id: string, key: string, value?: any | null }> } };

export type DatasetExplorerDatasetVersion_VersionFragment = { __typename?: 'DatasetVersion', id: string };

export const DatasetExplorerFile_FileFragmentDoc = gql`
    fragment DatasetExplorerFile_file on DatasetVersionFile {
  id
  filename
  ...DatasetFileSummary_file
  ...DatasetFileDataGrid_file
  ...DatasetFileMetadata_file
}
    ${DatasetFileSummary_FileFragmentDoc}
${DatasetFileDataGrid_FileFragmentDoc}
${DatasetFileMetadata_FileFragmentDoc}`;
export const DatasetExplorerDatasetVersion_VersionFragmentDoc = gql`
    fragment DatasetExplorerDatasetVersion_version on DatasetVersion {
  id
  ...DatasetFilesExplorer_version
}
    ${DatasetFilesExplorer_VersionFragmentDoc}`;