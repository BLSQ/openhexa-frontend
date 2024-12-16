import { useTranslation } from "react-i18next";
import Field from "core/components/forms/Field";
import Textarea from "core/components/forms/Textarea";
import React from "react";
import Checkbox from "core/components/forms/Checkbox";

type PublishPipelineDialogFormProps = {
  templateAlreadyExists: boolean;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  confirmPublishing: boolean;
  setConfirmPublishing: (value: boolean) => void;
};

export const PublishPipelineDialogForm = ({
  templateAlreadyExists,
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
      {!templateAlreadyExists && (
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
          </Field>{" "}
        </>
      )}
      <Field
        name="confirmPublishing"
        label={t("Confirm publishing")}
        required
        className="mb-3"
      >
        <Checkbox
          id="confirmPublishing"
          name="confirmPublishing"
          checked={confirmPublishing}
          onChange={(e) => setConfirmPublishing(e.target.checked)}
          label={t(
            "I confirm that I want to publish this Pipeline code as a Template with all OpenHexa users.",
          )}
        />
      </Field>
    </>
  );
};
