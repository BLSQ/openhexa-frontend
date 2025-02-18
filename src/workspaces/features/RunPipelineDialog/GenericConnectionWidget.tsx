import { gql } from "@apollo/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Combobox, MultiCombobox } from "core/components/forms/Combobox";
import useDebounce from "core/hooks/useDebounce";
import { useGetConnectionBySlugLazyQuery } from "./GenericConnectionWidget.generated";
import useIntersectionObserver from "core/hooks/useIntersectionObserver";

type GenericConnectionWidgetProps<T> = {
  parameter: any;
  form: any;
  workspaceSlug: string;
};

export const GET_CONNECTION_METADATA = gql`
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
      __typename
      ... on DHIS2Connection {
        queryMetadata(
          type: $type
          search: $search
          perPage: $perPage
          page: $page
        ) {
          items {
            __typename
            ... on DHIS2MetadataItem {
              id
              name
            }
            ... on DHIS2OrganisationUnitLevel {
              id
              name
              level
            }
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
  "organisation_units_picker.groups": "ORGANISATION_UNIT_GROUPS",
  "organisation_units_picker.levels": "ORGANISATION_UNIT_LEVELS",
  datasets_picker: "DATASETS",
  data_elements_picker: "DATA_ELEMENTS",
  "data_elements_picker.groups": "DATA_ELEMENT_GROUPS",
  indicators_picker: "INDICATORS",
  "indicators_picker.groups": "INDICATOR_GROUPS",
};

const GenericConnectionWidget = <T,>({
  parameter,
  form,
  workspaceSlug,
}: GenericConnectionWidgetProps<T>) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isFetched, setIsFetched] = useState(false);
  const { t } = useTranslation();

  const currentValue =
    form.formData[parameter.code] || (parameter.multiple ? [] : null);

  const [fetchData, { data, loading, error, fetchMore }] =
    useGetConnectionBySlugLazyQuery();

  useEffect(() => {
    setIsFetched(true);
    if (!form.formData[parameter.connection]) return;

    void fetchData({
      variables: {
        workspaceSlug,
        connectionSlug: form.formData[parameter.connection],
        type: widgetToQueryType[parameter.widget],
        search: debouncedQuery,
        perPage: 10,
        page: 1,
      },
    });
  }, [
    form.formData[parameter.connection],
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
        connectionSlug: form.formData[parameter.connection],
        type: widgetToQueryType[parameter.widget],
        search: debouncedQuery,
        perPage,
        page: 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    }).catch((err) => console.error("Error fetching more data:", err));
  }, [perPage]);

  const options = useMemo(() => {
    if (error) {
      console.error("Error fetching connection metadata:", error);
      return { items: [], totalItems: 0 };
    }

    const connection = data?.connectionBySlug;

    if (
      connection?.__typename !== "DHIS2Connection" ||
      !connection.queryMetadata
    ) {
      return { items: [], totalItems: 0 };
    }

    const items =
      connection.queryMetadata.items?.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      ) ?? [];

    return { items, totalItems: connection.queryMetadata.totalItems ?? 0 };
  }, [data, error, debouncedQuery]);

  const handleInputChange = useCallback(
    (event: any) => {
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
      const displayedNames = value
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            return (
              item.name ??
              (item.level ? `Level ${item.level}` : `(Unknown ID: ${item.id})`)
            );
          }
          const foundItem = options.items.find(
            (opt) => opt.id === item || opt.level === item,
          );
          return foundItem
            ? (foundItem.name ?? `Level ${foundItem.level}`)
            : `(Unknown ID: ${item})`;
        })
        .filter(Boolean);
      return displayedNames.join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return (
        value.name ??
        (value.level ? `Level ${value.level}` : `(Unknown ID: ${value.id})`)
      );
    }

    const selectedItem = options.items.find(
      (item) => item.id === value || item.level === value,
    );
    return selectedItem
      ? (selectedItem.name ?? `Level ${selectedItem.level}`)
      : `(Unknown ID: ${value})`;
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
          ? selectedValue.map((item) => item.id ?? item.level).filter(Boolean)
          : [];

        form.setFieldValue(parameter.code, selectedIds);
      } else {
        const newValue = selectedValue?.id ?? selectedValue?.level ?? null;
        form.setFieldValue(parameter.code, newValue);
      }
    },
    [form, parameter.code, parameter.multiple],
  );

  const selectedObjects = useMemo(() => {
    if (!form.formData[parameter.code]) return parameter.multiple ? [] : null;

    if (Array.isArray(form.formData[parameter.code])) {
      return form.formData[parameter.code].map(
        (id) =>
          options.items.find((item) => item.id === id) || {
            id,
            name: `(Unknown ID: ${id})`,
          },
      );
    }

    return (
      options.items.find(
        (item) => item.id === form.formData[parameter.code],
      ) || {
        id: form.formData[parameter.code],
        name: `(Unknown ID: ${form.formData[parameter.code]})`,
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
      disabled={!form.formData[parameter.connection] || !isFetched || loading}
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
