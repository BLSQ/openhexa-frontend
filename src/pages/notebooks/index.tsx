import { createGetServerSideProps } from "core/helpers/page";
import {
  NoteBooksPageDocument,
  useNoteBooksPageQuery,
} from "notebooks/graphql/queries.generated";

const NotebooksPage = () => {
  const { data } = useNoteBooksPageQuery();

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
      query: NoteBooksPageDocument,
    });
  },
});

export default NotebooksPage;
