import { gql } from "@apollo/client";
import Switch from "core/components/Switch/Switch";
import Input from "core/components/forms/Input/Input";
import Select from "core/components/forms/Select";
import Textarea from "core/components/forms/Textarea/Textarea";
import { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import WorkspaceConnectionPicker from "../WorkspaceConnectionPicker/WorkspaceConnectionPicker";
import { isConnectionParameter } from "workspaces/helpers/pipelines";
import DatasetPicker from "datasets/features/DatasetPicker";
import { ensureArray } from "core/helpers/array";
import GenericConnectionWidget from "./GenericConnectionWidget";

type ParameterFieldProps = {
  parameter: any;
  value: any;
  form: any;
  onChange(value: any): void;
  workspaceSlug?: string;
};

const ParameterField = (props: ParameterFieldProps) => {
  const { t } = useTranslation();
  const { parameter, value, form, onChange, workspaceSlug } = props;
  const [valueState, setValueState] = useState([]);

  const handleChange = useCallback(
    (value: any) => {
      if (parameter.multiple && (value === null || value === undefined)) {
        return onChange([]);
      } else if (parameter.multiple && !parameter.choices) {
        onChange(value.split(","));
      } else {
        onChange(value);
      }
    },
    [onChange, parameter.multiple, parameter.choices],
  );

  if (parameter.type === "bool") {
    return (
      <Switch
        name={parameter.code}
        checked={value ?? false}
        onChange={onChange}
      />
    );
  }
  const appendValues = (newValue: any) => {
    if (parameter.multiple) {
      setValueState([...valueState, newValue]);
    } else {
      setValueState(newValue);
    }
  };

  if (parameter.widget !== null && form !== undefined) {
    return (
      <GenericConnectionWidget
        parameter={parameter}
        form={form}
        value={valueState}
        onChange={appendValues}
        workspaceSlug={workspaceSlug || ""}
      />
    );
  }
  if (isConnectionParameter(parameter.type)) {
    console.log(parameter.type);
    return (
      <WorkspaceConnectionPicker
        workspaceSlug={workspaceSlug || ""}
        value={value ?? []}
        onChange={(option) => handleChange(option?.slug)}
        withPortal
        type={parameter.type}
      />
    );
  }

  if (parameter.type === "dataset") {
    return (
      <DatasetPicker
        workspaceSlug={workspaceSlug || ""}
        value={value}
        onChange={(option) => handleChange(option?.dataset.slug)}
        withPortal
      />
    );
  }

  if (parameter.choices?.length) {
    const choices =
      parameter.type !== "str"
        ? parameter.choices.map((choice: number) => String(choice))
        : parameter.choices;
    return (
      <Select
        onChange={handleChange}
        value={parameter.multiple ? ensureArray(value) : value}
        required={Boolean(parameter.required)}
        multiple={parameter.multiple}
        options={choices ?? []}
        getOptionLabel={(option) => option}
        by={(a, b) => a == b}
        onCreate={
          !parameter.choices
            ? (query) =>
                handleChange(
                  parameter.multiple ? [...(value ?? []), query] : query,
                )
            : undefined
        }
      />
    );
  }
  if (parameter.multiple) {
    return (
      <>
        <Textarea
          aria-label={parameter.code}
          name={parameter.code}
          rows={4}
          required={Boolean(parameter.required)}
          className="w-full"
          value={value ? value.join("\n") : ""}
          onChange={(event) => {
            handleChange(event.target.value);
          }}
          data-testid={`${parameter.code}-textarea`}
        ></Textarea>
        <small className="ml-2 text-gray-600">
          {t("Separate values with a new line")}
        </small>
      </>
    );
  }

  switch (parameter.type) {
    case "int":
    case "float":
      return (
        <Input
          type="number"
          fullWidth
          name={parameter.code}
          required={Boolean(parameter.required)}
          onChange={(event) => handleChange(event.target.value)}
          value={value ?? ""}
          data-testid={`${parameter.code}-input`}
        />
      );
    case "str":
      return (
        <Input
          type="text"
          fullWidth
          aria-label={parameter.code}
          name={parameter.code}
          required={Boolean(parameter.required)}
          onChange={(event) => handleChange(event.target.value)}
          value={value ?? ""}
          data-testid={`${parameter.code}-input`}
        />
      );
  }
  return null;
};

ParameterField.fragments = {
  parameter: gql`
    fragment ParameterField_parameter on PipelineParameter {
      code
      name
      help
      type
      default
      required
      choices
      connection
      widget
      multiple
    }
  `,
};

export default ParameterField;
