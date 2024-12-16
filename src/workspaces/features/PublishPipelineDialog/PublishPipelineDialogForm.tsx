import { useTranslation } from "react-i18next";
import Field from "core/components/forms/Field";
import Textarea from "core/components/forms/Textarea";
import React from "react";

type PublishPipelineDialogFormProps = {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
};

export const PublishPipelineDialogForm = ({
  name,
  setName,
  description,
  setDescription,
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
    </>
  );
};
