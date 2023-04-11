import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type ConnectionKeysSection_ConnectionFragment = { __typename?: 'Connection', slug: string, fields: Array<{ __typename?: 'ConnectionField', code: string, value?: string | null }> };

export const ConnectionKeysSection_ConnectionFragmentDoc = gql`
    fragment ConnectionKeysSection_connection on Connection {
  slug
  fields {
    code
    value
  }
}
    `;