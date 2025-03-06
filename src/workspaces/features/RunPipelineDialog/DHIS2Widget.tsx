import { gql } from "@apollo/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Combobox, MultiCombobox } from "core/components/forms/Combobox";
import useDebounce from "core/hooks/useDebounce";
import { useGetConnectionBySlugLazyQuery } from "./DHIS2Widget.generated";
import { ParameterField_ParameterFragment } from "./ParameterField.generated";
import useIntersectionObserver from "core/hooks/useIntersectionObserver";
import { FormInstance } from "../../../core/hooks/useForm";

type DHIS2WidgetProps = {
  parameter: ParameterField_ParameterFragment;
  connection: string;
  widget: string;
  form: FormInstance<any>;
  workspaceSlug: string;
};

export const GET_CONNECTION_METADATA = gql`
  query getConnectionBySlug(
    $workspaceSlug: String!
    $connectionSlug: String!
    $type: DHIS2MetadataType!
    $filters: [String!]
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
          filters: $filters
          perPage: $perPage
          page: $page
        ) {
          items {
            id
            label
          }
          totalItems
          error
        }
      }
    }
  }
`;

const dhis2WidgetToQuery: { [key: string]: string } = {
  DHIS2_ORG_UNITS: "ORG_UNITS",
  DHIS2_ORG_UNIT_GROUPS: "ORG_UNIT_GROUPS",
  DHIS2_ORG_UNIT_LEVELS: "ORG_UNIT_LEVELS",
  DHIS2_DATASET: "DATASETS",
  DHIS2_DATA_ELEMENTS: "DATA_ELEMENTS",
  DHIS2_DATA_ELEMENT_GROUPS: "DATA_ELEMENT_GROUPS",
  DHIS2_INDICATORS: "INDICATORS",
  DHIS2_INDICATOR_GROUPS: "INDICATOR_GROUPS",
};

const DHIS2Widget = ({
  parameter,
  connection,
  widget,
  form,
  workspaceSlug,
}: DHIS2WidgetProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [perPage, setPerPage] = useState(10);
  const [isFetched, setIsFetched] = useState(false);
  const { t } = useTranslation();

  const currentValue =
    form.formData[parameter.code] || (parameter.multiple ? [] : null);

  const [fetchData, { data, loading, error, fetchMore }] =
    useGetConnectionBySlugLazyQuery();

  const constructFilters = (query) => {
    if (query === "") return [];
    return ["name:token:" + query];
  };

  useEffect(() => {
    setIsFetched(true);
    if (!form.formData[connection]) return;
    void fetchData({
      variables: {
        workspaceSlug,
        connectionSlug: form.formData[connection],
        type: dhis2WidgetToQuery[widget],
        filters: constructFilters(debouncedQuery),
        perPage: 10,
        page: 1,
      },
    });
  }, [
    form.formData[connection],
    debouncedQuery,
    fetchData,
    workspaceSlug,
    parameter.widget,
  ]);

  useEffect(() => {
    if (perPage === 10) return;

    fetchMore({
      variables: {
        workspaceSlug,
        connectionSlug: form.formData[connection],
        type: dhis2WidgetToQuery[widget],
        filters: constructFilters(debouncedQuery),
        perPage,
        page: 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    }).catch((err) => console.error("Error fetching more data:", err));
  }, [perPage]);

  const errorMessage = useMemo(() => {
    if (error) {
      console.error("GraphQL Error:", error);
      return error.message || t("An unexpected error occurred.");
    }
    const connection = data?.connectionBySlug;
    if (
      connection?.__typename !== "DHIS2Connection" ||
      !connection.queryMetadata
    ) {
      return "";
    }
    const apiError = connection.queryMetadata.error;
    if (apiError) {
      console.error("API Error:", apiError);
      return t("Failed connect to DHIS2");
    }

    return "";
  }, [error, data, t]);

  const options = useMemo(() => {
    if (errorMessage) {
      return { items: [], totalItems: 0 };
    }
    const connection = data?.connectionBySlug;

    if (
      connection?.__typename !== "DHIS2Connection" ||
      !connection.queryMetadata
    ) {
      return { items: [], totalItems: 0 };
    }
    const items = connection.queryMetadata.items ?? [];

    items?.filter((c) => {
      c.label?.toLowerCase().includes(debouncedQuery.toLowerCase());
    });
    return { items, totalItems: connection.queryMetadata.totalItems ?? 0 };
  }, [data, errorMessage, debouncedQuery]);

  const handleInputChange = useCallback(
    (event: any) => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      if (fetchMore) {
        fetchMore({
          variables: {
            filters: constructFilters(newQuery),
            page: 1,
            perPage: perPage,
          },
        }).catch((err) => console.error("Error fetching more results:", err));
      }
    },
    [fetchMore],
  );

  const displayValueHandler = (value: any) => {
    if (!value) return "";

    const getLabel = (item: any) => {
      if (typeof item === "object" && item !== null) return item.label;
      const foundItem = options.items.find((opt) => opt.id === item);
      return foundItem?.label ?? t("Unknown ID: {{id}}", { id: item });
    };

    if (Array.isArray(value)) {
      return value.map(getLabel).filter(Boolean).join(", ");
    }

    return getLabel(value);
  };

  useEffect(() => {
    if (parameter.multiple && !Array.isArray(currentValue)) {
      form.setFieldValue(parameter.code, []);
    }
  }, [form, parameter.multiple, parameter.code]);

  const handleSelectionChange = useCallback(
    (selectedValue: any) => {
      if (parameter.multiple) {
        const selectedIds = Array.isArray(selectedValue)
          ? selectedValue.map((item) => item.id).filter(Boolean)
          : [];

        form.setFieldValue(parameter.code, selectedIds);
      } else {
        const newValue = selectedValue?.id;
        form.setFieldValue(parameter.code, newValue);
      }
    },
    [form, parameter.code, parameter.multiple],
  );

  const selectedObjects = useMemo(() => {
    if (!form.formData[parameter.code]) return parameter.multiple ? [] : null;

    if (Array.isArray(form.formData[parameter.code])) {
      return form.formData[parameter.code].map(
        (id: string) =>
          options.items.find((item) => item.id === id) || {
            id,
            label: t("Unknown ID: {{id}}", { id }),
          },
      );
    }

    return (
      options.items.find(
        (item) => item.id === form.formData[parameter.code],
      ) || {
        id: form.formData[parameter.code],
        label: t("Unknown ID: {{id}}", { id: form.formData[parameter.code] }),
      }
    );
  }, [form.formData[parameter.code], options.items]);

  const onScrollBottom = useCallback(() => {
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
      placeholder={t("Select options")}
      value={selectedObjects}
      disabled={!form.formData[connection] || !isFetched || loading}
      onClose={useCallback(() => setQuery(""), [])}
      error={errorMessage}
    >
      {options?.items.map((option) => (
        <Combobox.CheckOption key={option.id} value={option}>
          {option.label}
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

export { DHIS2Widget, dhis2WidgetToQuery };
