import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useMemo } from "react";
import Select from "core/components/forms/Select";
import { PipelineNotificationLevel } from "../../../graphql/types";
import { formatNotificationLevel } from "../../helpers/recipients/utils";
import { i18n } from "next-i18next";
import { ensureArray } from "../../../core/helpers/array";
import {
  Combobox,
  MultiCombobox,
} from "../../../core/components/forms/Combobox";

type GenericConnectionWidgetProps = {
  parameter: any;
  value: string | null;
  onChange: (value: string | null) => void;
  workspaceSlug: string;
};

const GET_CONNECTION_METADATA = gql`
  query getConnectionBySlug(
    $workspaceSlug: String!
    $connectionSlug: String!
    $type: String!
  ) {
    connectionBySlug(
      workspaceSlug: $workspaceSlug
      connectionSlug: $connectionSlug
    ) {
      ... on DHIS2Connection {
        queryMetadata(type: $type) {
          items {
            id
            name
          }
          error
        }
      }
    }
  }
`;

const widgetToQueryType: { [key: string]: string } = {
  organisation_units_picker: "ORGANISATION_UNITS",
  organisation_unit_groups_picker: "ORGANISATION_UNIT_GROUPS",
  organisation_unit_levels_picker: "ORGANISATION_UNIT_LEVELS",
  datasets_picker: "DATASETS",
  data_elements_picker: "DATA_ELEMENTS",
  data_element_groups_picker: "DATA_ELEMENT_GROUPS",
  indicators_picker: "INDICATORS",
  indicator_groups_picker: "INDICATOR_GROUPS",
};

const GenericConnectionWidget = ({
  parameter,
  form,
  value,
  onChange,
  workspaceSlug,
}: GenericConnectionWidgetProps) => {
  console.log("Parameter", parameter);
  console.log("Form", form);
  console.log("Widget", widgetToQueryType[parameter.widget]);

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

  const { data, loading, error } = useQuery(GET_CONNECTION_METADATA, {
    variables: {
      workspaceSlug,
      connectionSlug: form.formData[parameter.connection],
      type: widgetToQueryType[parameter.widget],
    },
    skip: !form.formData[parameter.connection],
  });

  // Convert API response into Select-compatible options
  const options = useMemo(() => {
    if (error) {
      console.error("Error fetching connection metadata:", error);
      return [];
    }
    return (
      data?.connectionBySlug?.queryMetadata?.items?.map(
        (item: { id: string; name: string }) => ({
          value: item.id,
          label: item.name,
        }),
      ) || []
    );
  }, [data, error]);
  console.log("Options", options);
  const PickerComponent: any = parameter.multiple ? MultiCombobox : Combobox;
  return (
    <Select
      value={parameter.multiple ? ensureArray(value) : value}
      loading={loading}
      displayValue={(value) => value?.label}
      placeholder={i18n!.t("Select notification level")}
      onChange={handleChange}
      required={Boolean(parameter.required)}
      getOptionLabel={(option) => option.label}
      options={options}
      filterOptions={(options, query) => {
        console.log("Query", query);
        return options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );
      }}
    />
  );
};

export default GenericConnectionWidget;
