import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import {
  useCreateWebappMutation,
  useUpdateWebappMutation,
} from "webapps/graphql/mutations.generated";
import { gql } from "@apollo/client";
import {
  WebappForm_WebappFragment,
  WebappForm_WorkspaceFragment,
} from "./WebappForm.generated";
import DataCard from "core/components/DataCard";
import TextProperty from "core/components/DataCard/TextProperty";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import useCacheKey from "core/hooks/useCacheKey";
import ImageProperty from "core/components/DataCard/ImageProperty";

type WebappFormProps = {
  webapp?: WebappForm_WebappFragment;
  workspace: WebappForm_WorkspaceFragment;
};

const WebappForm = ({ workspace, webapp }: WebappFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [createWebapp] = useCreateWebappMutation();
  const [updateWebapp] = useUpdateWebappMutation();

  const clearCache = useCacheKey("webapps");

  const onSave = async (values: any) => {
    try {
      if (webapp) {
        await updateWebapp({
          variables: { input: { id: webapp.id, ...values } },
        }).then(() => {
          toast.success(t("Webapp updated successfully"));
          clearCache();
        });
      } else {
        await createWebapp({
          variables: { input: { workspaceSlug: workspace.slug, ...values } },
        }).then(({ data }) => {
          if (!data?.createWebapp?.webapp) {
            throw new Error("Webapp creation failed");
          }
          toast.success(t("Webapp created successfully"));
          router.push(
            `/workspaces/${workspace.slug}/webapps/${data.createWebapp.webapp.id}`,
          );
        });
      }
    } catch (error) {
      toast.error(t("An error occurred while saving the webapp"));
    }
  };

  return (
    <DataCard item={webapp}>
      <DataCard.Heading
        titleAccessor={(item) => item?.name || t("New Webapp")}
      />
      <DataCard.FormSection
        title={t("Webapp Details")}
        onSave={webapp?.permissions.update ? onSave : undefined}
        collapsible={false}
        confirmButtonLabel={webapp ? t("Save") : t("Create")}
        onCancel={
          webapp
            ? undefined
            : () => router.push(`/workspaces/${workspace.slug}/webapps`)
        }
        forceEditMode={!webapp}
      >
        <TextProperty id="name" accessor="name" label={t("Name")} required />
        <ImageProperty
          id="icon"
          accessor="icon"
          label={""}
          editButtonLabel={t("Change Icon")}
        />
        <TextProperty id="url" accessor="url" label={t("URL")} required />
        <TextProperty
          id="description"
          accessor="description"
          label={t("Description")}
          markdown
        />
      </DataCard.FormSection>
      {webapp?.url && (
        <DataCard.Section>
          <div className="mt-4">
            <h2 className="text-lg font-medium">{t("Preview")}</h2>
            <iframe src={webapp?.url} className="w-full h-64 border" />
          </div>
        </DataCard.Section>
      )}
    </DataCard>
  );
};

WebappForm.fragment = {
  webapp: gql`
    fragment WebappForm_webapp on Webapp {
      id
      name
      description
      url
      icon
      permissions {
        update
        delete
      }
    }
  `,
  workspace: gql`
    fragment WebappForm_workspace on Workspace {
      ...WorkspaceLayout_workspace
    }
    ${WorkspaceLayout.fragments.workspace}
  `,
};

export default WebappForm;
