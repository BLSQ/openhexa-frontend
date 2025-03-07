import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const clearCache = useCacheKey("webapps");

  const updateExistingWebapp = async (values: any) => {
    setLoading(true);
    try {
      await updateWebapp({
        variables: { input: { id: webapp?.id, ...values } },
      }).then(() => {
        toast.success(t("Webapp updated successfully"));
        clearCache();
      });
    } catch (error) {
      toast.error(t("An error occurred while updating the webapp"));
    } finally {
      setLoading(false);
    }
  };

  const createNewWebapp = async (values: any) => {
    setLoading(true);
    try {
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
    } catch (error) {
      toast.error(t("An error occurred while creating the webapp"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataCard item={webapp}>
      <DataCard.Heading
        titleAccessor={(item) => item?.name || t("New Webapp")}
      />
      <DataCard.FormSection
        title={t("Webapp Details")}
        onSave={
          webapp
            ? webapp.permissions.update
              ? updateExistingWebapp
              : undefined
            : createNewWebapp
        }
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
      </DataCard.FormSection>
      {webapp?.url && (
        <DataCard.Section
          title={t("Preview")}
          collapsible={false}
          loading={loading}
        >
          <iframe
            src={webapp.url}
            className="w-full"
            style={{ height: "50vh" }}
          />
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
