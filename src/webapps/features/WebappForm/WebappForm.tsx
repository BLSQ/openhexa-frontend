import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Page from "core/components/Page";
import Button from "core/components/Button";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";

import useForm from "core/hooks/useForm";
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
import Field from "core/components/forms/Field";

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
    <Page title={webapp ? t("Edit Web App") : t("Create Web App")}>
      <WorkspaceLayout workspace={workspace}>
        <WorkspaceLayout.PageContent>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <Field
              label={t("Name")}
              name="name"
              value={form.formData.name}
              onChange={form.handleInputChange}
              required
            />
            <Field
              label={t("URL")}
              name="url"
              value={form.formData.url}
              onChange={form.handleInputChange}
              required
            />
            <Field
              label={t("Icon")}
              name="icon"
              value={form.formData.icon}
              onChange={form.handleInputChange}
            />
            <Button type="submit" disabled={form.isSubmitting || !isFormValid}>
              {form.isSubmitting
                ? t("Saving...")
                : webapp
                  ? t("Update")
                  : t("Create")}
            </Button>
          </form>
          {form.formData.url && (
            <div className="mt-4">
              <h2 className="text-lg font-medium">{t("Preview")}</h2>
              <iframe src={form.formData.url} className="w-full h-64 border" />
            </div>
          )}
        </WorkspaceLayout.PageContent>
      </WorkspaceLayout>
    </Page>
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
      isFavorite
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
