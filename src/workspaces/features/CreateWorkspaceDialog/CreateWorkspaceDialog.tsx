import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import Spinner from "core/components/Spinner";
import CountryPicker from "core/features/CountryPicker";
import { CountryPicker_CountryFragment } from "core/features/CountryPicker/CountryPicker.generated";
import useForm from "core/hooks/useForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCreateWorkspaceMutation } from "workspaces/graphql/mutations.generated";
import { ensureArray } from "core/helpers/array";
import { useRouter } from "next/router";

type CreateWorkspaceDialogProps = {
  onClose(): void;
  open: boolean;
};

type Form = {
  name: string;
  countries: Array<CountryPicker_CountryFragment>;
};

const CreateWorkspaceDialog = (props: CreateWorkspaceDialogProps) => {
  const router = useRouter();
  const [mutate] = useCreateWorkspaceMutation();

  const { t } = useTranslation();
  const { open, onClose } = props;
  const form = useForm<Form>({
    onSubmit(values) {
      mutate({
        variables: {
          input: {
            name: values.name,
            countries: ensureArray(values.countries).map(({ code }) => ({
              code,
            })),
          },
        },
      }).then(({ data }) =>
        router.push({
          pathname: "/workspaces/[id]",
          query: { id: data?.createWorkspace.workspace?.id },
        })
      );
    },
    validate: (values) => {
      const errors = {} as any;

      if (!values.name) {
        errors.name = t("Type a workspace name");
      }
      return errors;
    },
    initialState: {
      name: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.resetForm();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{t("Create a workspace")}</Dialog.Title>
      <form onSubmit={form.handleSubmit}>
        <Dialog.Content className="space-y-4">
          <Field
            name="name"
            required
            label={t("Workspace name")}
            value={form.formData.name}
            onChange={form.handleInputChange}
          />

          <Field
            name="country"
            label={t("Country")}
            help={t("Add the country flag to the workspace")}
          >
            <CountryPicker
              withPortal
              multiple
              value={form.formData.countries ?? []}
              onChange={(value) => form.setFieldValue("countries", value)}
            />
          </Field>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="white" type="button" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button disabled={form.isSubmitting || !form.isValid} type="submit">
            {form.isSubmitting && <Spinner size="xs" className="mr-1" />}
            {t("Create")}
          </Button>
        </Dialog.Actions>
      </form>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;