import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Spinner from "core/components/Spinner";
import useForm from "core/hooks/useForm";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import Field from "core/components/forms/Field";
import {
  PipelineNotificationEvent,
  PipelineRecipientError,
} from "graphql/types";
import { useUpdatePipelineRecipientMutation } from "workspaces/graphql/mutations.generated";
import { UpdatePipelineRecipient_PipelineRecipientFragment } from "./UpdatePipelineRecipientDialog.generated";
import SimpleSelect from "core/components/forms/SimpleSelect";

type UpdatePipelineRecipientDialogProps = {
  onClose(): void;
  open: boolean;
  recipient: UpdatePipelineRecipient_PipelineRecipientFragment;
};

type Form = {
  notificationEvent: PipelineNotificationEvent;
};

const UpdatePipelineRecipientDialog = (
  props: UpdatePipelineRecipientDialogProps,
) => {
  const { t } = useTranslation();
  const { open, onClose, recipient } = props;
  const [mutate] = useUpdatePipelineRecipientMutation();

  const form = useForm<Form>({
    onSubmit: async (values) => {
      const { data } = await mutate({
        variables: {
          input: {
            recipientId: recipient.id,
            notificationEvent: values.notificationEvent,
          },
        },
      });
      if (!data?.updatePipelineRecipient) {
        throw new Error("Unknown error.");
      }
      if (
        data.updatePipelineRecipient.errors.includes(
          PipelineRecipientError.PermissionDenied,
        )
      ) {
        throw new Error("You are not authorized to perform this action");
      }
      onClose();
    },
    initialState: { notificationEvent: recipient.notificationEvent },
  });

  useEffect(() => {
    if (open) {
      form.resetForm();
    }
  }, [open, form]);

  return (
    <Dialog onSubmit={form.handleSubmit} open={open} onClose={onClose}>
      <Dialog.Title>{t("Edit recipient")}</Dialog.Title>
      <Dialog.Content className="space-y-4">
        <Field
          name="notificationEvent"
          label={t("Notification event")}
          required
        >
          <SimpleSelect
            name="notificationEvent"
            value={form.formData.notificationEvent}
            onChange={form.handleInputChange}
            required
          >
            <option value={PipelineNotificationEvent.AllEvents}>
              {t("All events")}
            </option>
            <option value={PipelineNotificationEvent.PipelineFailed}>
              {t("Pipeline failed")}
            </option>
          </SimpleSelect>
        </Field>
        {form.submitError && (
          <div className="text-danger mt-3 text-sm">{form.submitError}</div>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button disabled={form.isSubmitting} type="submit">
          {form.isSubmitting && <Spinner size="xs" className="mr-1" />}
          {t("Save")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

UpdatePipelineRecipientDialog.fragments = {
  recipient: gql`
    fragment UpdatePipelineRecipient_PipelineRecipient on PipelineRecipient {
      id
      notificationEvent
    }
  `,
};

export default UpdatePipelineRecipientDialog;
