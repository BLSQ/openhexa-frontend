import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
import { DatasetFileSummary_FileFragmentDoc } from './DatasetFileSummary/DatasetFileSummary.generated';
import { DatasetFileDataGrid_FileFragmentDoc } from './DatasetFileDataGrid/DatasetFileDataGrid.generated';
import { DatasetFilesExplorer_VersionFragmentDoc } from './DatasetFilesExplorer/DatasetFilesExplorer.generated';
export type DatasetExplorerFile_FileFragment = { __typename?: 'DatasetVersionFile', id: string, filename: string, contentType: string, createdAt: any, fileSample?: { __typename?: 'DatasetFileSample', sample?: any | null, status: Types.FileSampleStatus } | null };

export type DatasetExplorerVersionFragment = { __typename?: 'DatasetVersion', id: string };

export const DatasetExplorerFile_FileFragmentDoc = gql`
    fragment DatasetExplorerFile_file on DatasetVersionFile {
  id
  filename
  ...DatasetFileSummary_file
  ...DatasetFileDataGrid_file
}
    ${DatasetFileSummary_FileFragmentDoc}
${DatasetFileDataGrid_FileFragmentDoc}`;
export const DatasetExplorerVersionFragmentDoc = gql`
    fragment DatasetExplorerVersion on DatasetVersion {
  id
  ...DatasetFilesExplorer_version
}
    ${DatasetFilesExplorer_VersionFragmentDoc}`;