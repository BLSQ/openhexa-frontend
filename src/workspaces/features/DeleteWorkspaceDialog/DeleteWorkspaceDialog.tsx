import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Spinner from "core/components/Spinner";
import useForm from "core/hooks/useForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDeleteWorkspaceMutation } from "workspaces/graphql/mutations.generated";
import { Workspace } from "graphql-types";
import Router from "next/router";
import useCacheKey from "core/hooks/useCacheKey";

type DeleteWorkspaceDialogProps = {
  onClose(): void;
  open: boolean;
  workspace: Omit<
    Workspace,
    "createdAt" | "updatedAt" | "createdBy" | "memberships" | "countries"
  >;
};

type Form = {
  description: string;
};

const DeleteWorkspaceDialog = (props: DeleteWorkspaceDialogProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { open, onClose, workspace } = props;

  const [mutate] = useDeleteWorkspaceMutation();

  const clearCache = useCacheKey(["workspaces", workspace.id]);

  const form = useForm<Form>({
    onSubmit: async () => {
      await mutate({
        variables: {
          input: {
            id: workspace.id,
          },
        },
      });
      clearCache();
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (!open) {
      form.resetForm();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{`${t("Delete")} ${workspace.name}`}</Dialog.Title>
      <form onSubmit={form.handleSubmit}>
        <Dialog.Content className="space-y-4">
          <p>
            {t("You're about to delete this workspace and all it's content.")}
          </p>
        </Dialog.Content>

        <Dialog.Actions>
          <Button variant="white" type="button" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button disabled={form.isSubmitting || !form.isValid} type="submit">
            {form.isSubmitting && <Spinner size="xs" className="mr-1" />}
            {t("Delete")}
          </Button>
        </Dialog.Actions>
      </form>
    </Dialog>
  );
};

export default DeleteWorkspaceDialog;
