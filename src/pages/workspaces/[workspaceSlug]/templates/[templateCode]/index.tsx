import DataCard from "core/components/DataCard";
import TextProperty from "core/components/DataCard/TextProperty";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import {
  useWorkspaceTemplatePageQuery,
  WorkspaceTemplatePageDocument,
  WorkspaceTemplatePageQuery,
  WorkspaceTemplatePageQueryVariables,
} from "workspaces/graphql/queries.generated";
import { updatePipeline } from "workspaces/helpers/pipelines";
import useCacheKey from "core/hooks/useCacheKey";
import TemplateLayout from "workspaces/layouts/TemplateLayout";

type Props = {
  templateCode: string;
  workspaceSlug: string;
};

const WorkspaceTemplatePage: NextPageWithLayout = (props: Props) => {
  const { templateCode, workspaceSlug } = props;
  const { t } = useTranslation();

  const [isVersionConfigDialogOpen, setVersionConfigDialogOpen] =
    useState(false);

  const { data, refetch } = useWorkspaceTemplatePageQuery({
    variables: {
      workspaceSlug,
      templateCode,
    },
  });
  const clearCache = useCacheKey(["templates"], refetch);

  if (!data?.workspace || !data?.template) {
    return null;
  }

  const { workspace, template } = data;

  const onSaveTemplate = async (values: any) => {
    await updatePipeline(template.id, {
      // TODO
      name: values.name,
      description: values.description,
    });
  };

  return (
    <Page title={template.name ?? t("Template")}>
      <TemplateLayout workspace={workspace} template={template}>
        <DataCard.FormSection
          title={t("Information")}
          onSave={template.permissions.delete ? onSaveTemplate : undefined} // TODO
          collapsible={false}
        >
          <TextProperty
            id="description"
            accessor={"description"}
            label={t("Description")}
            defaultValue="-"
            visible={(value, isEditing) => isEditing || value}
            sm
            hideLabel
            markdown
          />
          <TextProperty
            id="name"
            accessor={"name"}
            label={t("Name")}
            visible={(value, isEditing) => isEditing}
          />
          <TextProperty
            id="code"
            accessor={"code"}
            label={t("Code")}
            help={t(
              "This is the code used to identify this template using the cli.",
            )}
            readonly
          />
        </DataCard.FormSection>
      </TemplateLayout>
    </Page>
  );
};

WorkspaceTemplatePage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    await TemplateLayout.prefetch(ctx, client);

    const { data } = await client.query<
      WorkspaceTemplatePageQuery,
      WorkspaceTemplatePageQueryVariables
    >({
      query: WorkspaceTemplatePageDocument,
      variables: {
        workspaceSlug: ctx.params!.workspaceSlug as string,
        templateCode: ctx.params!.templateCode as string,
      },
    });

    if (!data.workspace || !data.template) {
      return { notFound: true };
    }
    return {
      props: {
        workspaceSlug: ctx.params!.workspaceSlug,
        templateCode: ctx.params!.templateCode,
      },
    };
  },
});

export default WorkspaceTemplatePage;
