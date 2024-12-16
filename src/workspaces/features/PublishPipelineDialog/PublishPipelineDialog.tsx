import { gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Button from "core/components/Button";
import Spinner from "core/components/Spinner";
import React, { useState } from "react";
import Dialog from "core/components/Dialog";
import {
  PipelinePublish_PipelineFragment,
  PipelinePublish_WorkspaceFragment,
} from "./PublishPipelineDialog.generated";
import { useCreateTemplateVersionMutation } from "pipelines/graphql/mutations.generated";
import { CreateTemplateVersionError } from "graphql/types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { PublishPipelineDialogForm } from "./PublishPipelineDialogForm";
import { isEmpty } from "lodash";

type PublishPipelineDialogProps = {
  open: boolean;
  onClose: () => void;
  pipeline: PipelinePublish_PipelineFragment;
  workspace: PipelinePublish_WorkspaceFragment;
};

// TODO : test the button show or not show + test confirmation
// TODO : rename pipelinetemplate
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirmPublishing, setConfirmPublishing] = useState(false);

  const [createTemplateVersion] = useCreateTemplateVersionMutation();

  const onSubmit = async () => {
    setIsSubmitting(true);
    const pipelineVersionId = pipeline.currentVersion?.id;
    if (!pipelineVersionId) {
      setIsSubmitting(false);
      toast.error(t("The pipeline version is not available."));
      return;
    }
    const { data } = await createTemplateVersion({
      variables: {
        input: {
          name,
          code: name,
          description,
          config: "",
          workspace_slug: workspace.slug,
          pipeline_id: pipeline.id,
          pipeline_version_id: pipelineVersionId,
        },
      },
    });
    setIsSubmitting(false);

    if (!data?.createTemplateVersion) {
      toast.error("Unknown error.");
      return;
    }

    if (data.createTemplateVersion.success) {
      onClose();
      await router.push(`/workspaces/${workspace.slug}/pipelines/`); // TODO : Redirect to the new template page when this feature is available
      toast.success(successMessage);
    } else if (
      data.createTemplateVersion.errors?.includes(
        CreateTemplateVersionError.PermissionDenied,
      )
    ) {
      toast.error(t("You are not allowed to create a Template."));
    } else {
      toast.error(t("Unknown error."));
    }
  };
  const templateName = pipeline.template?.name;
  const successMessage = templateAlreadyExists
    ? t("New Template Version for '{{templateName}}' created successfully.", {
        templateName,
      })
    : t("New Template '{{name}}' created successfully.", {
        name,
      });
  const actionMessage = templateAlreadyExists
    ? t("Add a new version to Template '{{templateName}}'", {
        templateName,
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
          <PublishPipelineDialogForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            confirmPublishing={confirmPublishing}
            setConfirmPublishing={setConfirmPublishing}
          />
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!confirmPublishing || isEmpty(name) || isEmpty(description)}
        >
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
