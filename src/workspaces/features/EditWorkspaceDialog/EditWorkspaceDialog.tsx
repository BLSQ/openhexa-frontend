import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import Spinner from "core/components/Spinner";
import useForm from "core/hooks/useForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Workspace } from "graphql-types";
import Textarea from "core/components/forms/Textarea";
import Label from "core/components/forms/Label";
import { useUpdateWorkspaceMutation } from "workspaces/graphql/mutations.generated";

type CreateWorkspaceDialogProps = {
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

const EditWorkspaceDialog = (props: CreateWorkspaceDialogProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { open, onClose, workspace } = props;

  const [mutate] = useUpdateWorkspaceMutation();

  const form = useForm<Form>({
    onSubmit(values) {
      mutate({
        variables: {
          input: {
            id: workspace.id,
            description: values.description ?? workspace.description ?? "",
          },
        },
      }).then(({ data }) => onClose());
    },
    validate: (values) => {
      const errors = {} as any;

      if (!values.description) {
        errors.description = t("Workspace description should not be empty");
      }
      return errors;
    },
    initialState: {
      description: workspace.description || "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.resetForm();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-5xl">
      <Dialog.Title>{t("Edit workspace description")}</Dialog.Title>
      <form onSubmit={form.handleSubmit}>
        <Dialog.Content className="space-y-4">
          <Textarea
            name="description"
            required
            value={form.formData.description}
            onChange={form.handleInputChange}
            rows={20}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="white" type="button" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button disabled={form.isSubmitting || !form.isValid} type="submit">
            {form.isSubmitting && <Spinner size="xs" className="mr-1" />}
            {t("Save")}
          </Button>
        </Dialog.Actions>
      </form>
    </Dialog>
  );
};

export default EditWorkspaceDialog;
