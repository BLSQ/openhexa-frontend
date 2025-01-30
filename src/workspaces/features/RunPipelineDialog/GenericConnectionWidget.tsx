import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useMemo, useState } from "react";
import { i18n } from "next-i18next";
import {
  Combobox,
  MultiCombobox,
} from "../../../core/components/forms/Combobox";
import useDebounce from "../../../core/hooks/useDebounce";

type GenericConnectionWidgetProps<T> = {
  parameter: any;
  value: T[] | T;
  onChange: (value: any) => void;
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

const GenericConnectionWidget = <T,>({
  parameter,
  form,
  value,
  onChange,
  workspaceSlug,
}: GenericConnectionWidgetProps<T>) => {
  console.log("Value", value);
  console.log("Form", form);
  console.log("Widget", widgetToQueryType[parameter.widget]);

  const { data, loading, error } = useQuery(GET_CONNECTION_METADATA, {
    variables: {
      workspaceSlug,
      connectionSlug: form.formData[parameter.connection],
      type: widgetToQueryType[parameter.widget],
    },
    skip: !form.formData[parameter.connection],
  });

  // Convert API response into Select-compatible options
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const options = useMemo(() => {
    if (error) {
      console.error("Error fetching connection metadata:", error);
      return [];
    }
    const lowercaseQuery = debouncedQuery.toLowerCase();
    return (
      data?.connectionBySlug?.queryMetadata?.items?.filter((c) =>
        c.name.toLowerCase().includes(lowercaseQuery),
      ) ?? []
    );
  }, [data, error]);

  const PickerComponent: any = parameter.multiple ? MultiCombobox : Combobox;

  return (
    <PickerComponent
      required={parameter.required}
      onChange={onChange}
      loading={loading}
      displayValue={(value) => value?.map((v: any) => v.name).join("")}
      by="id"
      onInputChange={useCallback(
        (event: any) => setQuery(event.target.value),
        [],
      )}
      placeholder={i18n!.t("Select notification level")}
      value={value as any}
      onClose={useCallback(() => setQuery(""), [])}
      disabled={loading}
      withPortal={false}
    >
      {options.map((option) => (
        <Combobox.CheckOption key={option.id} value={option}>
          <div className="flex items-center">{option.name}</div>
        </Combobox.CheckOption>
      ))}
    </PickerComponent>
  );
};

export default GenericConnectionWidget;
