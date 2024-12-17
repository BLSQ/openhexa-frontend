import { gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Button from "core/components/Button";
import Spinner from "core/components/Spinner";
import React, { useEffect, useState } from "react";
import Dialog from "core/components/Dialog";
import {
  PipelinePublish_PipelineFragment,
  PipelinePublish_WorkspaceFragment,
} from "./PublishPipelineDialog.generated";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useForm from "core/hooks/useForm";
import { isEmpty } from "lodash";
import Field from "core/components/forms/Field";
import Textarea from "core/components/forms/Textarea";
import Checkbox from "core/components/forms/Checkbox";
import { useCreatePipelineTemplateVersionMutation } from "pipelines/graphql/mutations.generated";
import { CreatePipelineTemplateVersionError } from "graphql/types";

type PublishPipelineDialogProps = {
  open: boolean;
  onClose: () => void;
  pipeline: PipelinePublish_PipelineFragment;
  workspace: PipelinePublish_WorkspaceFragment;
};

const PublishPipelineDialog = ({
  open,
  onClose,
  pipeline,
  workspace,
}: PublishPipelineDialogProps) => {
  const { t } = useTranslation();
  const templateAlreadyExists = !!pipeline.template;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [createPipelineTemplateVersion] =
    useCreatePipelineTemplateVersionMutation();

  const form = useForm<{
    name: string;
    description: string;
    confirmPublishing: boolean;
  }>({
    initialState: {
      name: "",
      description: "",
      confirmPublishing: false,
    },
    async onSubmit(values) {
      setIsSubmitting(true);
      const pipelineVersionId = pipeline.currentVersion?.id;
      if (!pipelineVersionId) {
        setIsSubmitting(false);
        toast.error(t("The pipeline version is not available."));
        return;
      }
      const { data } = await createPipelineTemplateVersion({
        variables: {
          input: {
            name: values.name,
            code: values.name,
            description: values.description,
            config: "",
            workspaceSlug: workspace.slug,
            pipelineId: pipeline.id,
            pipelineVersionId: pipelineVersionId,
          },
        },
      });
      setIsSubmitting(false);

      if (!data?.createPipelineTemplateVersion) {
        toast.error("Unknown error.");
        return;
      }

      if (data.createPipelineTemplateVersion.success) {
        onClose();
        await router.push(`/workspaces/${workspace.slug}/pipelines/`);
        toast.success(successMessage);
      } else if (
        data.createPipelineTemplateVersion.errors?.includes(
          CreatePipelineTemplateVersionError.PermissionDenied,
        )
      ) {
        toast.error(t("You are not allowed to create a Template."));
      } else {
        toast.error(t("Unknown error."));
      }
    },
    validate(values) {
      const errors: any = {};
      if (!templateAlreadyExists && isEmpty(values.name)) {
        errors.name = t("Name is required");
      }
      if (!templateAlreadyExists && isEmpty(values.description)) {
        errors.description = t("Description is required");
      }
      if (!values.confirmPublishing) {
        errors.confirmPublishing = t("You must confirm publishing");
      }
      return errors;
    },
  });

  useEffect(() => {
    form.resetForm();
  }, [open, form]);

  const successMessage = templateAlreadyExists
    ? t("New Template Version for '{{templateName}}' created successfully.", {
        templateName: pipeline.template?.name,
      })
    : t("New Template '{{name}}' created successfully.", {
        name: form.formData.name,
      });
  const actionMessage = templateAlreadyExists
    ? t("Add a new version to Template '{{templateName}}'", {
        templateName: pipeline.template?.name,
      })
    : t("Create a new Template");

  return (
    <Dialog open={open} onClose={onClose} className={"w-300"}>
      <Dialog.Title>{actionMessage}</Dialog.Title>
      <Dialog.Content className={"w-300"}>
        {templateAlreadyExists ? (
          t(
            "This pipeline is already published as a Template. You can add a new version by publishing {{versionName}}.",
            { versionName: pipeline.currentVersion?.versionName },
          )
        ) : (
          <>
            <Field
              name="name"
              label={t("Template name")}
              required
              fullWidth
              className="mb-3"
              value={form.formData.name}
              onChange={(e) => form.setFieldValue("name", e.target.value)}
            />
            <Field
              name="description"
              label={t("Template description")}
              required
            >
              <Textarea
                id="description"
                name="description"
                required
                rows={10}
                value={form.formData.description}
                onChange={(e) =>
                  form.setFieldValue("description", e.target.value)
                }
              />
            </Field>
          </>
        )}
        <Field
          name="confirmPublishing"
          label={t("Confirm publishing")}
          required
          className="mt-3 mb-3"
        >
          <Checkbox
            id="confirmPublishing"
            name="confirmPublishing"
            checked={form.formData.confirmPublishing}
            onChange={(e) =>
              form.setFieldValue("confirmPublishing", e.target.checked)
            }
            label={t(
              "I confirm that I want to publish this Pipeline code as a Template with all OpenHexa users.",
            )}
          />
        </Field>
        {form.submitError && (
          <div className="mt-3 text-sm text-red-600">{form.submitError}</div>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={form.handleSubmit} disabled={form.isSubmitting}>
          {isSubmitting && <Spinner size="xs" className="mr-1" />}
          {actionMessage}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

PublishPipelineDialog.fragment = {
  pipeline: gql`
    fragment PipelinePublish_pipeline on Pipeline {
      id
      currentVersion {
        id
        versionName
      }
      template {
        name
      }
    }
  `,
  workspace: gql`
    fragment PipelinePublish_workspace on Workspace {
      slug
    }
  `,
};

export default PublishPipelineDialog;
