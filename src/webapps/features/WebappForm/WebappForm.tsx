import { useEffect, useState } from "react";
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
import { isEmpty } from "lodash";
import useForm from "core/hooks/useForm";
import DataCard from "core/components/DataCard";
import TextProperty from "core/components/DataCard/TextProperty";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

type WebappFormProps = {
  webapp?: WebappForm_WebappFragment;
  workspace: WebappForm_WorkspaceFragment;
};

const WebappForm = ({ workspace, webapp }: WebappFormProps) => {
  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const [createWebapp] = useCreateWebappMutation();
  const [updateWebapp] = useUpdateWebappMutation();

  const form = useForm({
    initialState: {
      name: webapp?.name || "",
      url: webapp?.url || "",
      icon: webapp?.icon || "",
    },
    async onSubmit(values) {
      try {
        if (webapp) {
          await updateWebapp({
            variables: { input: { id: webapp.id, ...values } },
          });
          toast.success(t("Webapp updated successfully"));
        } else {
          await createWebapp({
            variables: { input: { workspaceSlug: workspace.slug, ...values } },
          });
          toast.success(t("Webapp created successfully"));
        }
        router.push(`/workspaces/${workspace.slug}/webapps`);
      } catch (error) {
        toast.error(t("An error occurred while saving the webapp"));
      }
    },
    validate(values) {
      const errors: any = {};
      if (!values.name) errors.name = t("Name is required");
      if (!values.url) errors.url = t("URL is required");
      setIsFormValid(isEmpty(errors));
      return errors;
    },
  });

  useEffect(() => {
    form.validate();
  }, [form.formData]);

  return (
    <DataCard item={form.formData}>
      <DataCard.Heading<typeof form.formData>
        titleAccessor={(item) => item.name || t("New Webapp")}
      />
      <DataCard.FormSection
        title={t("Webapp Details")}
        onSave={(values) => {
          form.setFormData(values);
          form.handleSubmit();
          router.push(`/workspaces/${workspace.slug}/webapps`);
        }}
        collapsible={false}
        confirmButtonLabel={webapp ? t("Save") : t("Create")}
        onCancel={
          webapp
            ? undefined
            : () => router.push(`/workspaces/${workspace.slug}/webapps`)
        }
        editMode
      >
        <TextProperty id="name" accessor="name" label={t("Name")} required />
        <TextProperty id="url" accessor="url" label={t("URL")} required />
        <TextProperty id="icon" accessor="icon" label={t("Icon")} />
      </DataCard.FormSection>
      {form.formData.url && (
        <DataCard.Section>
          <div className="mt-4">
            <h2 className="text-lg font-medium">{t("Preview")}</h2>
            <iframe src={form.formData.url} className="w-full h-64 border" />
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
