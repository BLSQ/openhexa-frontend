import { TrashIcon } from "@heroicons/react/24/outline";
import Badge from "core/components/Badge";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import CodeEditor from "core/components/CodeEditor";
import DataCard from "core/components/DataCard";
import { OnSaveFn } from "core/components/DataCard/FormSection";
import TextProperty from "core/components/DataCard/TextProperty";
import DescriptionList from "core/components/DescriptionList";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ConnectionFieldsSection from "workspaces/features/ConnectionFieldsSection";
import { useUpdateWorkspaceConnectionMutation } from "workspaces/graphql/mutations.generated";
import {
  useWorkspaceConnectionPageQuery,
  WorkspaceConnectionPageDocument,
  WorkspaceConnectionPageQuery,
  WorkspaceConnectionPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import { TYPES } from "workspaces/helpers/connection";
import { FAKE_WORKSPACE } from "workspaces/helpers/fixtures";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type Props = {
  workspaceSlug: string;
  connectionId: string;
};

const WorkspacePipelinePage: NextPageWithLayout = ({
  workspaceSlug,
  connectionId,
}: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useWorkspaceConnectionPageQuery({
    variables: { workspaceSlug, connectionId },
  });

  const [updateConnection] = useUpdateWorkspaceConnectionMutation();

  const onSave: OnSaveFn = async (values, item) => {
    await updateConnection({
      variables: {
        input: {
          id: item.id,
          name: values.name,
          slug: values.slug,
          description: values.description,
        },
      },
    });
  };

  if (!data?.workspace || !data?.connection) {
    return null;
  }
  const { workspace, connection } = data;

  const type = TYPES.find((t) => t.value === connection.type);
  if (!connection || !type) {
    return null;
  }

  return (
    <Page title={t("Workspace")}>
      <WorkspaceLayout.Header className="flex items-center justify-between">
        <Breadcrumbs withHome={false}>
          <Breadcrumbs.Part
            isFirst
            href={`/workspaces/${encodeURIComponent(workspace.slug)}`}
          >
            {workspace.name}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            href={`/workspaces/${encodeURIComponent(
              workspace.slug
            )}/connections`}
          >
            {t("Connections")}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            isLast
            href={`/workspaces/${encodeURIComponent(
              workspace.slug
            )}/pipelines/${encodeURIComponent(connection.id)}`}
          >
            {connection.name}
          </Breadcrumbs.Part>
        </Breadcrumbs>
        {connection.permissions.delete && (
          <Button
            size="sm"
            className="bg-red-700 hover:bg-red-700 focus:ring-red-500"
            leadingIcon={<TrashIcon className="w-4" />}
          >
            {t("Delete")}
          </Button>
        )}
      </WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <DataCard item={connection} className="divide-y-2 divide-gray-100">
          <DataCard.FormSection
            onSave={onSave}
            title={t("Information")}
            className="space-y-4"
          >
            <DescriptionList.Item label={t("Type")}>
              <Badge className={type.color}>{type.label ?? "custom"}</Badge>
            </DescriptionList.Item>
            <TextProperty
              id="description"
              label={t("Description")}
              accessor="description"
              markdown
            />
          </DataCard.FormSection>
          <DataCard.Section title={t("Code samples")}>
            <CodeEditor
              readonly
              lang="json"
              value={FAKE_WORKSPACE.database.workspaceTables[0].codeSample[0]}
            />
          </DataCard.Section>
          <DataCard.Section title={t("Fields")}>
            <ConnectionFieldsSection connection={connection} />
          </DataCard.Section>
        </DataCard>
      </WorkspaceLayout.PageContent>
    </Page>
  );
};

WorkspacePipelinePage.getLayout = (page, pageProps) => {
  return <WorkspaceLayout pageProps={pageProps}>{page}</WorkspaceLayout>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const workspaceSlug = ctx.params?.workspaceSlug as string;
    const connectionId = ctx.params?.connectionId as string;
    const { data } = await client.query<
      WorkspaceConnectionPageQuery,
      WorkspaceConnectionPageQueryVariables
    >({
      query: WorkspaceConnectionPageDocument,
      variables: { workspaceSlug, connectionId },
    });

    if (!data.workspace || !data.connection) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        connectionId,
        workspaceSlug,
      },
    };
  },
});

export default WorkspacePipelinePage;
