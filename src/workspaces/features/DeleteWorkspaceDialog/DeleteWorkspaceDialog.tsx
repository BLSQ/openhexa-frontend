import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Spinner from "core/components/Spinner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDeleteWorkspaceMutation } from "workspaces/graphql/mutations.generated";
import { Workspace } from "graphql-types";
import useCacheKey from "core/hooks/useCacheKey";

type DeleteWorkspaceDialogProps = {
  onClose(): void;
  open: boolean;
  workspace: Pick<Workspace, "id" | "name">;
};

const DeleteWorkspaceDialog = (props: DeleteWorkspaceDialogProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { open, onClose, workspace } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mutate] = useDeleteWorkspaceMutation();

  const clearCache = useCacheKey(["workspaces", workspace.id]);

  const deleteWorkspace = async () => {
    setIsSubmitting(true);
    await mutate({
      variables: {
        input: {
          id: workspace.id,
        },
      },
    });

    clearCache();
    setIsSubmitting(false);
    router.push("/dashboard");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{`${t("Delete")} ${workspace.name}`}</Dialog.Title>
      <Dialog.Content className="space-y-4">
        <p>
          {t("You're about to delete this workspace and all it's content.")}
        </p>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" type="button" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={deleteWorkspace}>
          {isSubmitting && <Spinner size="xs" className="mr-1" />}
          {t("Delete")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteWorkspaceDialog;
