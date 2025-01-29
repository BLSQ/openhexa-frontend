import { Trans, useTranslation } from "react-i18next";
import Button from "core/components/Button";
import { PipelineTemplateError } from "graphql/types";
import Dialog from "core/components/Dialog";
import { toast } from "react-toastify";
import { useDeletePipelineTemplateMutation } from "workspaces/graphql/mutations.generated";
import useCacheKey from "core/hooks/useCacheKey";

type DeleteTemplateDialogProps = {
  open: boolean;
  templateId: string;
  onClose: () => void;
};

const DeleteTemplateDialog = (props: DeleteTemplateDialogProps) => {
  const { t } = useTranslation();
  const { open, templateId, onClose } = props;

  const clearTemplateCache = useCacheKey(["templates"]);

  const [deletePipelineTemplate] = useDeletePipelineTemplateMutation();

  const deleteTemplate = async () => {
    const { data } = await deletePipelineTemplate({
      variables: {
        input: {
          id: templateId,
        },
      },
    });

    if (!data?.deletePipelineTemplate) {
      throw new Error("Unknown error.");
    }

    if (data.deletePipelineTemplate.success) {
      clearTemplateCache();
      toast.success(t("Successfully deleted pipeline template"));
    }
    if (
      data.deletePipelineTemplate.errors.includes(
        PipelineTemplateError.PermissionDenied,
      )
    ) {
      toast.error(t("You are not allowed to delete this template."));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{t("Delete pipeline")}</Dialog.Title>
      <Dialog.Content className="space-y-4">
        <p>
          <Trans>
            Are you sure you want to delete pipeline <b>name</b> ?
          </Trans>
        </p>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={deleteTemplate}>{t("Delete")}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteTemplateDialog;
