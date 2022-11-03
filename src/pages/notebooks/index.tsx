import { useCollectionsPageQuery } from "collections/graphql/queries.generated";
import { PageContent } from "core/components/Layout/PageContent";
import { createGetServerSideProps } from "core/helpers/page";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Page from "core/components/Layout/Page";
import {
  NotebooksUrlDocument,
  useNotebooksUrlQuery,
} from "notebooks/graphql/queries.generated";

type Props = {
  page: number;
  perPage: number;
};

// Refresh list on deletion

const NoteBooksPage = (props: Props) => {
  const { t } = useTranslation();
  const { data } = useNotebooksUrlQuery();

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <iframe className="flex-1" src={data.notebooksUrl}></iframe>
    </div>
  );
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    await client.query({
      query: NotebooksUrlDocument,
    });
    return { props: {} };
  },
});

export default NoteBooksPage;
