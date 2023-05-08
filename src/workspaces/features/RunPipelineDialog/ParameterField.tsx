import { gql } from "@apollo/client";
import Switch from "core/components/Switch/Switch";
import Input from "core/components/forms/Input/Input";
import Textarea from "core/components/forms/Textarea/Textarea";
import { ensureArray } from "core/helpers/array";
import { useCallback } from "react";

type ParameterFieldProps = {
  parameter: any;
  value: any;
  onChange(value: any): void;
};

const ParameterField = (props: ParameterFieldProps) => {
  const { parameter, value, onChange } = props;

  const handleChange = useCallback(
    (value: any) => {
      if (!value) {
        onChange(parameter.multiple ? [] : null);
      }
      let internalValue = ensureArray(value); // It's easier to manipulate an array
      if (parameter.type === "float") {
        internalValue = internalValue.map((v) => parseFloat(v));
      } else if (parameter.type === "int") {
        internalValue = internalValue.map((v) => parseInt(v, 10));
      }

      onChange(parameter.multiple ? internalValue : internalValue[0]);
    },
    [parameter.type, onChange, parameter.multiple]
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

  if (parameter.multiple || parameter.choices?.length) {
    return (
      <Textarea
        name="value"
        rows={2}
        className="w-full"
        value={value && value.join("\n")}
        onChange={(event) => {
          handleChange(event.target.value.split("\n") || []);
        }}
      />
    );
  }

  switch (parameter.type) {
    case "int":
    case "float":
      return (
        <Input
          type="number"
          name={parameter.code}
          required={parameter.required ?? true}
          onChange={(event) => handleChange(event.target.value)}
          value={value || ""}
        />
      );
    case "str":
      return (
        <Input
          type="text"
          name={parameter.code}
          required={parameter.required ?? true}
          onChange={(event) => handleChange(event.target.value)}
          value={value || ""}
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
      multiple
    }
  `,
};

export default ParameterField;
