import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  convertParametersToPipelineInput,
  isConnectionParameter,
} from "workspaces/helpers/pipelines";
import useForm from "core/hooks/useForm";
import { PipelineVersion } from "graphql/types";
import { ensureArray } from "core/helpers/array";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import Button from "core/components/Button";

type PipliveVersionConfigProps = {
  pipeliveVersion: PipelineConfigVersionDialog_Version;
  onClose(): void;
  open: boolean;
};

const PipelineVersionConfigDialog = (props: PipliveVersionConfigProps) => {
  const { pipeliveVersion, onClose, open } = props;
  const { t } = useTranslation();

  const [updatePipeliveVersionConfig] = useMutation(gql`
    mutation UpdatePipelineVersionConfig($input: UpdatePipelineVersionInput!) {
      updatePipelineVersion(input: $input) {
        success
        errors
        pipelineVersion {
          ...PipelineConfigVersionDialog_Version
        }
      }
    }
  `);

  const form = useForm<{ version: PipelineVersion; [key: string]: any }>({
    async onSubmit(values) {
      const { version, ...params } = values;
      console.log("Submitting version ", version);
    },
    getInitialState() {
      let state: any = {
        version: null,
      };
      return state;
    },
    validate(values) {
      const errors = {} as any;
      const { version, ...fields } = values;
      if (!version) {
        return { version: t("The version is required") };
      }
      const normalizedValues = convertParametersToPipelineInput(
        version,
        fields,
      );
      for (const parameter of version.parameters) {
        const val = normalizedValues[parameter.code];
        if (parameter.type === "int" || parameter.type === "float") {
          if (ensureArray(val).length === 0 && parameter.required) {
            errors[parameter.code] = t("This field is required");
          } else if (ensureArray(val).some((v) => isNaN(v))) {
            errors[parameter.code] = t("This field must contain only numbers");
          }
        }

        if (
          ["str", "dataset"].includes(parameter.type) &&
          parameter.required &&
          ensureArray(val).length === 0
        ) {
          errors[parameter.code] = t("This field is required");
        }
        if (
          isConnectionParameter(parameter.type) &&
          parameter.required &&
          !val
        ) {
          errors[parameter.code] = t("This field is required");
        }
      }
      return errors;
    },
  });

  useEffect(() => {
    const version = form.formData.version;
    if (version) {
      form.resetForm();
      form.setFieldValue("version", version);
      version.parameters.map((param) => {
        if (pipeliveVersion?.config[param.code] !== null) {
          form.setFieldValue(
            param.code,
            pipeliveVersion.config[param.code],
            false,
          );
        } else {
          form.setFieldValue(param.code, param.default, false);
        }
      });
    }
  }, [form, form.formData.version]);

  const parameters = form.formData.version?.parameters ?? [];

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={form.handleSubmit}>
        <Dialog.Title onClose={onClose}>
          {t("Change version configration")}
        </Dialog.Title>
        <Dialog.Content className="space-y-4">
          <Field
            name="Name"
            label={t("Name")}
            value={form.formData.name}
            onChange={form.handleInputChange}
          ></Field>
          <div></div>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={onClose} variant={"outlined"}></Button>
        </Dialog.Actions>
      </form>
    </Dialog>
  );
};

PipelineVersionConfigDialog.fragments = {
  version: gql`
    fragment PipelineConfigVersionDialog_Version on PipelineVersion {
      id
      name
      description
      externalLink
      isLatestVersion
      createdAt
      config
      parameters {
        code
        name
        type
        multiple
        required
        help
      }
    }
  `,
};

export default PipelineVersionConfigDialog;
