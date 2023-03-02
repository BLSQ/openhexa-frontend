import * as Types from '../../../graphql-types';

import { gql } from '@apollo/client';
export type GenerateWorkspaceDatabasePasswordFragment = { __typename?: 'Workspace', slug: string };

export const GenerateWorkspaceDatabasePasswordFragmentDoc = gql`
    fragment GenerateWorkspaceDatabasePassword on Workspace {
  slug
}
    `;