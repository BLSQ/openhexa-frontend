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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createTemplateVersion] = useCreateTemplateVersionMutation();

  const onSubmit = async () => {
    setIsSubmitting(true);
    const pipelineVersionId = pipeline.currentVersion?.id;
    if (!pipelineVersionId) {
      setIsSubmitting(false);
      window.alert(t("The pipeline version is not available."));
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
      throw new Error("Unknown error.");
    }

    if (data.createTemplateVersion.success) {
      onClose();
      await router.push(`/workspaces/${workspace.slug}/pipelines/`); // TODO : Redirect to the new template page when this feature is available
      toast.success(
        t(
          templateAlreadyExists
            ? "New Template Version created successfully."
            : "New Template created successfully.",
        ),
      );
    } else if (
      data.createTemplateVersion.errors?.includes(
        CreateTemplateVersionError.PermissionDenied,
      )
    ) {
      window.alert(t("Not allowed to create a template."));
    } else {
      window.alert(t("Unknown error."));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className={"w-200"}>
      <Dialog.Title>
        {t(
          templateAlreadyExists
            ? "Add a Template Version"
            : "Create a Template",
        )}
      </Dialog.Title>
      <Dialog.Content className={"w-200"}>
        {templateAlreadyExists ? (
          t(
            "This pipeline is already a template. You can add a new version of the template by publishing the latest version of this pipeline.",
          )
        ) : (
          <PublishPipelineDialogForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
          />
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={onSubmit}>
          {isSubmitting && <Spinner size="xs" className="mr-1" />}
          {t(
            templateAlreadyExists
              ? "Add a Template Version"
              : "Create a Template",
          )}
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
