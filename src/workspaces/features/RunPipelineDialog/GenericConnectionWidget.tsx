import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  form: any;
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
  workspaceSlug,
}: GenericConnectionWidgetProps<T>) => {
  console.log("GenericConnectionWidget Debug:", {
    widgetType: widgetToQueryType[parameter.widget],
    currentValue: form.formData[parameter.code],
    parameterCode: parameter.code,
    form: form,
  });

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const currentValue =
    form.formData[parameter.code] || (parameter.multiple ? [] : null);

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
    return (
      data?.connectionBySlug?.queryMetadata?.items?.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      ) ?? []
    );
  }, [data, error, debouncedQuery]);

  const handleInputChange = useCallback(
    (event) => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      if (fetchMore) {
        fetchMore({ variables: { search: newQuery, offset: 0 } }).catch((err) =>
          console.error("Error fetching more results:", err),
        );
      }
    },
    [fetchMore],
  );

  const loadMore = () => {
    if (!fetchMore || loading) return;
    fetchMore({ variables: { offset: options.length } }).catch((err) =>
      console.error("Error fetching more data:", err),
    );
  };

  const displayValueHandler = (value: any) => {
    if (!value) return "";
    if (Array.isArray(value)) {
      return value.map((v: any) => v.name).join(", ");
    }
    return typeof value === "object" && value !== null ? value.name : "";
  };

  useEffect(() => {
    if (parameter.multiple && !Array.isArray(currentValue)) {
      form.setFieldValue(parameter.code, []);
    }
  }, [form, parameter.multiple, parameter.code]);

  const handleSelectionChange = useCallback(
    (selectedValue: any) => {
      if (parameter.multiple) {
        form.setFieldValue(parameter.code, selectedValue ?? []);
      } else {
        form.setFieldValue(parameter.code, selectedValue ?? null);
      }
    },
    [form, parameter.code, parameter.multiple],
  );

  const PickerComponent = parameter.multiple ? MultiCombobox : Combobox;

  return (
    <PickerComponent
      onChange={handleSelectionChange}
      loading={loading}
      displayValue={displayValueHandler}
      by="id"
      onInputChange={handleInputChange}
      placeholder={i18n!.t("Select options")}
      value={currentValue}
      disabled={loading}
      onClose={useCallback(() => setQuery(""), [])}
    >
      {options.map((option) => (
        <Combobox.CheckOption key={option.id} value={option}>
          {option.name}
        </Combobox.CheckOption>
      ))}
      <button onClick={loadMore} disabled={loading}>
        {i18n!.t("Load more")}
      </button>
    </PickerComponent>
  );
};

export default GenericConnectionWidget;
