import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type DatabaseVariablesSection_WorkspaceFragment = { __typename?: 'Workspace', slug: string, database: { __typename?: 'Database', name: string, username: string, password: string, host: string, port: number, externalUrl: string } };

export const DatabaseVariablesSection_WorkspaceFragmentDoc = gql`
    fragment DatabaseVariablesSection_workspace on Workspace {
  slug
  database {
    name
    username
    password
    host
    port
    externalUrl
  }
}
    `;