import { gql, useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import useDebounce from "core/hooks/useDebounce";
import { Combobox } from "core/components/forms/Combobox";
import { ObjectPickerQuery } from "./ObjectPicker.generated";

export type ObjectPickerOption = { key: string; path: string; name: string };

type ObjectPickerProps = {
  value?: ObjectPickerOption;
  filter?: string;
  workspaceSlug: string;
  placeholder?: string;
  onChange(value: ObjectPickerOption): void;
  required?: boolean;
  disabled?: boolean;
  withPortal?: boolean;
  ignoreHiddenFiles?: boolean;
};

const ObjectPicker = (props: ObjectPickerProps) => {
  const { t } = useTranslation();
  const {
    workspaceSlug,
    value,
    disabled = false,
    required = false,
    withPortal = false,
    onChange,
    filter = "",
    ignoreHiddenFiles = true,
    placeholder = t("Select Object"),
  } = props;

  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<ObjectPickerQuery>(
    gql`
      query ObjectPicker(
        $slug: String!
        $query: String!
        $page: Int
        $ignoreHiddenFiles: Boolean
        $ignoreDelimiter: Boolean
      ) {
        workspace(slug: $slug) {
          slug
          bucket {
            objects(
              query: $query
              page: $page
              ignoreHiddenFiles: $ignoreHiddenFiles
              ignoreDelimiter: $ignoreDelimiter
            ) {
              items {
                name
                key
                path
              }
              hasNextPage
            }
          }
        }
      }
    `,
    {
      variables: {
        slug: workspaceSlug,
        query: filter,
        page: page,
        ignoreHiddenFiles: ignoreHiddenFiles,
        ignoreDelimiter: true,
      },
    },
  );

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);

  const options = useMemo(() => {
    const lowercaseQuery = debouncedQuery.toLowerCase();

    return (
      data?.workspace?.bucket.objects.items.filter(
        (item: ObjectPickerOption) => {
          return item.name.toLowerCase().includes(lowercaseQuery);
        },
      ) ?? []
    );
  }, [data, debouncedQuery]);

  const displayValue = useCallback(
    (option: ObjectPickerOption) => (option ? option.name : ""),
    [],
  );

  const comboBoxValue = useMemo(() => {
    return (
      options.find(
        (option: ObjectPickerOption) => option.path === value?.path,
      ) ?? null
    );
  }, [value, options]);

  return (
    <Combobox
      required={required}
      onChange={onChange}
      loading={loading}
      withPortal={withPortal}
      displayValue={displayValue}
      onInputChange={useCallback(
        (event: any) => setQuery(event.target.value),
        [],
      )}
      value={comboBoxValue as any}
      placeholder={placeholder}
      onClose={useCallback(() => setQuery(""), [])}
      disabled={disabled}
    >
      {options.map((option: ObjectPickerOption) => (
        <Combobox.CheckOption key={option.key} value={option}>
          {option.name}{" "}
          <span className="font-light text-xs">{`(${option.key})`}</span>
        </Combobox.CheckOption>
      ))}
    </Combobox>
  );
};

export default ObjectPicker;
