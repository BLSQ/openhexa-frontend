import { createGetServerSideProps } from "core/helpers/page";
import {
  NotebooksPageDocument,
  useNotebooksPageQuery,
} from "notebooks/graphql/queries.generated";

const NotebooksPage = () => {
  const { data } = useNotebooksPageQuery();

  if (!data) {
    return null;
  }

  return <div></div>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    await client.query({
      query: NotebooksPageDocument,
    });
  },
});

export default NotebooksPage;
