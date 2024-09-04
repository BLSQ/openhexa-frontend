import * as Types from '../../../graphql/types';

import { gql } from '@apollo/client';
export type DatasetTabs_DatasetlinkFragment = { __typename?: 'DatasetLink', id: string, dataset: { __typename?: 'Dataset', slug: string, workspace?: { __typename?: 'Workspace', slug: string } | null }, workspace: { __typename?: 'Workspace', slug: string } };

export const DatasetTabs_DatasetlinkFragmentDoc = gql`
    fragment DatasetTabs_datasetlink on DatasetLink {
  id
  dataset {
    slug
    workspace {
      slug
    }
  }
  workspace {
    slug
  }
}
    `;