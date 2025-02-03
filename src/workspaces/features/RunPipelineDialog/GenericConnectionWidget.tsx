import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useMemo, useState } from "react";
import { i18n } from "next-i18next";
import {
  Combobox,
  MultiCombobox,
} from "../../../core/components/forms/Combobox";
import useDebounce from "../../../core/hooks/useDebounce";
import { GetConnectionBySlugQuery } from "./GenericConnectionWidget.generated";

type GenericConnectionWidgetProps<T> = {
  disabled?: boolean;
  parameter: any;
  value: T[] | T;
  form: any;
  onChange: (value: any) => void;
  workspaceSlug: string;
  placeholder?: string;
};

const GET_CONNECTION_METADATA = gql`
  query getConnectionBySlug(
    $workspaceSlug: String!
    $connectionSlug: String!
    $type: String!
    $search: String
    $limit: Int
    $offset: Int
  ) {
    connectionBySlug(
      workspaceSlug: $workspaceSlug
      connectionSlug: $connectionSlug
    ) {
      ... on DHIS2Connection {
        queryMetadata(
          type: $type
          search: $search
          limit: $limit
          offset: $offset
        ) {
          items {
            id
            name
          }
          totalCount
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
  console.log(
    "Value of " + widgetToQueryType[parameter.widget] + " : " + value,
  );
  console.log("Form", form);
  console.log("Parameter", parameter);

  // Convert API response into Select-compatible options
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);

  const { data, loading, error, fetchMore } =
    useQuery<GetConnectionBySlugQuery>(GET_CONNECTION_METADATA, {
      variables: {
        workspaceSlug,
        connectionSlug: form.formData[parameter.connection],
        type: widgetToQueryType[parameter.widget],
        search: debouncedQuery,
        limit: 10,
        offset: 0,
      },
      skip: !form.formData[parameter.connection],
    });

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
  }, [data, error, debouncedQuery]);

  const handleInputChange = useCallback(
    (event) => {
      setQuery(event.target.value);
      fetchMore({
        variables: {
          search: event.target.value,
          offset: 0,
        },
      });
    },
    [fetchMore],
  );
  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data?.connectionBySlug?.queryMetadata?.items?.length || 0,
      },
    });
  };
  const displayValueHanlder = (value: any) => {
    if (!value) return "";
    if (Array.isArray(value)) {
      return value.map((v: any) => v.name).join("");
    }
    return value.name || "";
    // value?.map((v: any) => v.name).join("")
  };
  const PickerComponent: any = parameter.multiple ? MultiCombobox : Combobox;

  return (
    <PickerComponent
      required={parameter.required}
      onChange={onChange}
      loading={loading}
      displayValue={(value) => displayValueHanlder(value)}
      by="id"
      onInputChange={handleInputChange}
      placeholder={i18n!.t("Select options")}
      value={value as any}
      disabled={loading}
    >
      {options.map((option) => (
        <MultiCombobox.CheckOption key={option.id} value={option}>
          <div className="flex items-center">{option.name}</div>
        </MultiCombobox.CheckOption>
      ))}
      <button onClick={loadMore} disabled={loading}>
        {i18n!.t("Load more")}
      </button>
    </PickerComponent>
  );
};

export default GenericConnectionWidget;
