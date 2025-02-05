import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { i18n } from "next-i18next";
import {
  Combobox,
  MultiCombobox,
} from "../../../core/components/forms/Combobox";
import useDebounce from "../../../core/hooks/useDebounce";
import {
  GetConnectionBySlugQuery,
  useGetConnectionBySlugLazyQuery,
} from "./GenericConnectionWidget.generated";
import useIntersectionObserver from "../../../core/hooks/useIntersectionObserver";

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
    $perPage: Int
    $page: Int
  ) {
    connectionBySlug(
      workspaceSlug: $workspaceSlug
      connectionSlug: $connectionSlug
    ) {
      ... on DHIS2Connection {
        queryMetadata(
          type: $type
          search: $search
          perPage: $perPage
          page: $page
        ) {
          items {
            id
            name
          }
          totalItems
          error
        }
      }
    }
  }
`;

const widgetToQueryType: { [key: string]: string } = {
  organisation_units_picker: "ORGANISATION_UNITS",
  "organisation_units_picker.group": "ORGANISATION_UNIT_GROUPS",
  "organisation_units_picker.levels": "ORGANISATION_UNIT_LEVELS",
  datasets_picker: "DATASETS",
  data_elements_picker: "DATA_ELEMENTS",
  "data_elements_picker.group": "DATA_ELEMENT_GROUPS",
  indicators_picker: "INDICATORS",
  "indicators_picker.group": "INDICATOR_GROUPS",
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
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const currentValue =
    form.formData[parameter.code] || (parameter.multiple ? [] : null);

  const [fetchData, { data, loading, error, fetchMore }] =
    useGetConnectionBySlugLazyQuery({ cachePolicy: "no-cache" });

  useEffect(() => {
    if (!form.formData[parameter.connection]) return;

    fetchData({
      variables: {
        workspaceSlug,
        connectionSlug: form.formData[parameter.connection],
        type: widgetToQueryType[parameter.widget],
        search: debouncedQuery,
        perPage: 10, // Default perPage
        page: 1, // Start from page 1
      },
    }).catch((err) =>
      console.error("Error fetching connection metadata:", err),
    );
  }, [
    form.formData[parameter.connection],
    debouncedQuery,
    fetchData,
    workspaceSlug,
    parameter.widget,
  ]);

  useEffect(() => {
    if (perPage === 10) return; // Skip if it's the initial load

    fetchMore({
      variables: {
        workspaceSlug,
        connectionSlug: form.formData[parameter.connection],
        type: widgetToQueryType[parameter.widget],
        search: debouncedQuery,
        perPage,
        page: 1, // Always load from the start with the new perPage
      },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    }).catch((err) => console.error("Error fetching more data:", err));
  }, [perPage]);

  const options = useMemo(() => {
    if (error) {
      console.error("Error fetching connection metadata:", error);
      return [];
    }
    const items =
      data?.connectionBySlug?.queryMetadata?.items?.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      ) ?? [];
    const totalItems = data?.connectionBySlug?.queryMetadata?.totalItems ?? 0;
    return { items, totalItems };
  }, [data, error, debouncedQuery]);

  const handleInputChange = useCallback(
    (event) => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      if (fetchMore) {
        fetchMore({
          variables: { search: newQuery, page: page, perPage: perPage },
        }).catch((err) => console.error("Error fetching more results:", err));
      }
    },
    [fetchMore],
  );

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

  const onScrollBottom = useCallback(() => {
    console.log("onScrollBottom", { options, loading });
    if (options?.totalItems > (options?.items?.length || 0) && !loading) {
      setPerPage((prevPerPage) => prevPerPage + 10);
    }
  }, [options, loading]);
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
      {options?.items.map((option) => (
        <Combobox.CheckOption key={option.id} value={option}>
          {option.name}
        </Combobox.CheckOption>
      ))}
      {onScrollBottom && (
        <IntersectionObserverWrapper onScrollBottom={onScrollBottom} />
      )}
    </PickerComponent>
  );
};
const IntersectionObserverWrapper = ({
  onScrollBottom,
}: {
  onScrollBottom: () => void;
}) => {
  const [lastElement, setLastElement] = useState<Element | null>(null);
  const list = useIntersectionObserver(lastElement, {});

  useEffect(() => {
    if (lastElement && list?.isIntersecting) {
      onScrollBottom();
    }
  }, [onScrollBottom, list, lastElement]);

  return <div ref={setLastElement}></div>;
};
export default GenericConnectionWidget;
