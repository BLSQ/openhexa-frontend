import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type ConnectionFieldsSection_ConnectionFragment = { __typename?: 'Connection', id: string, fields: Array<{ __typename?: 'ConnectionField', code: string, value?: string | null, secret: boolean, updatedAt?: any | null }>, permissions: { __typename?: 'ConnectionPermissions', update: boolean } };

export const ConnectionFieldsSection_ConnectionFragmentDoc = gql`
    fragment ConnectionFieldsSection_connection on Connection {
  id
  fields {
    code
    value
    secret
    updatedAt
  }
  permissions {
    update
  }
}
    `;