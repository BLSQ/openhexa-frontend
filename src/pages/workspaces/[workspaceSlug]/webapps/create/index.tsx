import WebappForm from "webapps/features/WebappForm";
import { createGetServerSideProps } from "core/helpers/page";
import {
  WorkspacePageDocument,
  WorkspacePageQuery,
} from "workspaces/graphql/queries.generated";

const WebappCreatePage = ({ workspace }: any) => {
  return <WebappForm workspace={workspace} />;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    const { data } = await client.query<WorkspacePageQuery>({
      query: WorkspacePageDocument,
      variables: {
        slug: ctx.params?.workspaceSlug as string,
      },
    });
    return {
      props: {
        workspace: data.workspace,
      },
    };
  },
});

export default WebappCreatePage;
