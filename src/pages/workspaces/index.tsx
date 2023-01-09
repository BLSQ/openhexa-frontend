import { createGetServerSideProps } from "core/helpers/page";
import {
  WorkspacesPageDocument,
  WorkspacesPageQuery,
} from "workspaces/graphql/queries.generated";

const WorkspacesHome = () => {
  return <></>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const { data } = await client.query<WorkspacesPageQuery>({
      query: WorkspacesPageDocument,
      variables: {},
    });

    if (!data.workspaces) {
      return {
        notFound: true,
      };
    }
    const latestWorkspace = data.workspaces.items[0];
    return {
      redirect: {
        permanent: false,
        destination: `/workspaces/${latestWorkspace.id}`,
      },
    };
  },
});

export default WorkspacesHome;
