import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  convertParametersToPipelineInput,
  isConnectionParameter,
} from "workspaces/helpers/pipelines";

import useForm from "core/hooks/useForm";
import { PipelineVersion, UpdatePipelineVersionError } from "graphql/types";
import { ensureArray } from "core/helpers/array";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import Button from "core/components/Button";
import clsx from "clsx";
import ParameterField from "../RunPipelineDialog/ParameterField";
type PipliveVersionConfigProps = {
  pipelineVersion: PipelineVersion;
  workspaceSlug: string;
  onClose(): void;
  open: boolean;
};

const PipelineVersionConfigDialog = (props: PipliveVersionConfigProps) => {
  const { pipelineVersion, onClose, open, workspaceSlug } = props;
  const { t } = useTranslation();

  const [updatepipelineVersionConfig] = useMutation(gql`
    mutation UpdatePipelineVersionConfig($input: UpdatePipelineVersionInput!) {
      updatePipelineVersion(input: $input) {
        success
        errors
        pipelineVersion {
          id
          name
          description
          externalLink
          isLatestVersion
          createdAt
          config
          parameters {
            ...ParameterField_parameter
          }
        }
      }
    }
    ${ParameterField.fragments.parameter}
  `);

  const form = useForm<{ version: PipelineVersion; [key: string]: any }>({
    async onSubmit(values) {
      const { version, ...params } = values;
      const { data } = await updatepipelineVersionConfig({
        variables: {
          input: {
            id: version.id,
            config: convertParametersToPipelineInput(version, params),
          },
        },
      });
      if (data?.errors?.includes(UpdatePipelineVersionError.PermissionDenied)) {
        throw new Error("You cannot update this version.");
      } else if (!data?.updatePipelineVersion.success) {
        throw new Error("An error occurred while updating the version.");
      }
      onClose();
    },
    getInitialState() {
      let state: any = {
        version: pipelineVersion,
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
        if (pipelineVersion?.config[param.code] !== undefined) {
          form.setFieldValue(
            param.code,
            pipelineVersion.config[param.code],
            false,
          );
        } else {
          form.setFieldValue(param.code, param.default, false);
        }
      });
    }
  }, [form, form.formData.version]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={form.handleSubmit}>
        <Dialog.Title onClose={onClose}>
          {t("Change version configration")}
        </Dialog.Title>
        <Dialog.Content className="space-y-4">
          <div
            className={clsx(
              "grid gap-x-3 gap-y-4",
              pipelineVersion.parameters.length > 4 && "grip-cols-2 gap-x-5",
            )}
          >
            {pipelineVersion.parameters.map((param, i) => (
              <Field
                required={param.required || param.type === "bool"}
                key={i}
                name={param.code}
                label={param.name}
                help={param.help}
                error={form.touched[param.code] && form.errors[param.code]}
              >
                <ParameterField
                  parameter={param}
                  value={form.formData[param.code]}
                  onChange={(value: any) => {
                    form.setFieldValue(param.code, value);
                  }}
                  workspaceSlug={workspaceSlug}
                ></ParameterField>
              </Field>
            ))}
          </div>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={onClose} variant={"outlined"}>
            {t("Cancel")}
          </Button>
          <Button disabled={form.isSubmitting} type="submit">
            {t("Save")}
          </Button>
        </Dialog.Actions>
      </form>
    </Dialog>
  );
};

PipelineVersionConfigDialog.fragments = {
  update: gql`
    fragment PipelineVersionConfig_update on PipelineVersion {
      id
      name
      description
      externalLink
      isLatestVersion
      createdAt
      config
      parameters {
        ...ParameterField_parameter
      }
    }
    ${ParameterField.fragments.parameter}
  `,
};

export default PipelineVersionConfigDialog;
