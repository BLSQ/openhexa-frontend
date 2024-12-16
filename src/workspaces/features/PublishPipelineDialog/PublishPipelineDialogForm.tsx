import { useTranslation } from "react-i18next";
import Field from "core/components/forms/Field";
import Textarea from "core/components/forms/Textarea";
import React from "react";
import Checkbox from "core/components/forms/Checkbox";
import { Trans } from "next-i18next";

type PublishPipelineDialogFormProps = {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  confirmPublishing: boolean;
  setConfirmPublishing: (value: boolean) => void;
};

export const PublishPipelineDialogForm = ({
  name,
  setName,
  description,
  setDescription,
  confirmPublishing,
  setConfirmPublishing,
}: PublishPipelineDialogFormProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Field
        name="name"
        label={t("Template name")}
        required
        fullWidth
        className="mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Field
        name="description"
        label={t("Template description")}
        required
        className="mb-3"
      >
        <Textarea
          id="description"
          name="description"
          required
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <Field
        name="confirmPublishing"
        required
        className="mb-3 flex items-center"
      >
        <Checkbox
          id="confirmPublishing"
          name="confirmPublishing"
          className="mr-3"
          checked={confirmPublishing}
          onChange={(e) => setConfirmPublishing(e.target.checked)}
        />
        <Trans>
          I confirm that I want to publish this Pipeline code as a Template with
          all OpenHexa users.
        </Trans>
      </Field>
    </>
  );
};
