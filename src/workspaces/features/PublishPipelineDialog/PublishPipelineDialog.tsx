import { gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Button from "core/components/Button";
import Spinner from "core/components/Spinner";
import { PipelineError } from "graphql/types";
import React, { useState } from "react";
import { useDeletePipelineMutation } from "workspaces/graphql/mutations.generated";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import Textarea from "core/components/forms/Textarea";
import {
  PipelinePublish_PipelineFragment,
  PipelinePublish_WorkspaceFragment,
} from "./PublishPipelineDialog.generated";

type PublishPipelineDialog = {
  open: boolean;
  onClose: () => void;
  pipeline: PipelinePublish_PipelineFragment;
  workspace: PipelinePublish_WorkspaceFragment;
};

const PublishPipelineDialog = (props: PublishPipelineDialog) => {
  const { t } = useTranslation();

  const { open, onClose, pipeline, workspace } = props;
  const templateAlreadyExists = !!pipeline.template;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletePipeline] = useDeletePipelineMutation();

  const onSubmit = async () => {
    setIsSubmitting(true);
    const { data } = await deletePipeline({
      variables: {
        input: {
          id: pipeline.id,
        },
      },
    });

    if (!data?.deletePipeline) {
      throw new Error("Unknown error.");
    }

    if (data.deletePipeline.success) {
      setIsSubmitting(false);
      router.push({
        pathname: "/workspaces/[workspaceSlug]/pipelines",
        query: { workspaceSlug: workspace.slug },
      });
    }
    if (data.deletePipeline.errors.includes(PipelineError.PermissionDenied)) {
      setIsSubmitting(false);
      window.alert(t("Cannot delete a running or queued pipeline."));
    }
  };

  // TODO : Button action
  // TODO : test
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
          <>
            <Field
              name="name"
              label={t("Template name")}
              required
              fullWidth
              className="mb-3"
            />
            <Field
              name="description"
              label={t("Template description")}
              required
              className="mb-3"
            >
              <Textarea name="description" required rows={20} />
            </Field>
          </>
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