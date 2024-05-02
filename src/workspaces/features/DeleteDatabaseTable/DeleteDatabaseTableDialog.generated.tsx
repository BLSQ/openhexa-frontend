import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type DatabaseTableDelete_DatabaseFragment = { __typename?: 'DatabaseTable', name: string };

export type DatabaseTableDelete_WorkspaceFragment = { __typename?: 'Workspace', slug: string };

export const DatabaseTableDelete_DatabaseFragmentDoc = gql`
    fragment DatabaseTableDelete_database on DatabaseTable {
  name
}
    `;
export const DatabaseTableDelete_WorkspaceFragmentDoc = gql`
    fragment DatabaseTableDelete_workspace on Workspace {
  slug
}
    `;