import * as Types from '../../graphql/types';

import { gql } from '@apollo/client';
export type WebPage_PageFragment = { __typename?: 'WebPage', id: string, title: string, url: string, fullWidth: boolean, height?: string | null };

export const WebPage_PageFragmentDoc = gql`
    fragment WebPage_page on WebPage {
  id
  title
  url
  fullWidth
  height
  url
}
    `;