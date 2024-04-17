import { gql, useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import useDebounce from "core/hooks/useDebounce";
import { Combobox } from "core/components/forms/Combobox";
import { WorkspaceNotebooksPickerQuery } from "./NotebooksPicker.generated";

export type NotebookPickerOption = { key: string; path: string; name: string };

type NotebooksPickerProps = {
  value?: NotebookPickerOption;
  workspaceSlug: string;
  placeholder?: string;
  onChange(value: NotebookPickerOption): void;
  required?: boolean;
  disabled?: boolean;
  withPortal?: boolean;
};

const NotebooksPickerProps = (props: NotebooksPickerProps) => {
  const { t } = useTranslation();
  const {
    workspaceSlug,
    value,
    disabled = false,
    required = false,
    withPortal = false,
    onChange,
    placeholder = t("Select Notebook"),
  } = props;
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<WorkspaceNotebooksPickerQuery>(
    gql`
      query WorkspaceNotebooksPicker(
        $slug: String!
        $query: String!
        $page: Int
      ) {
        workspace(slug: $slug) {
          slug
          bucket {
            objects(query: $query, page: $page) {
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
    { variables: { slug: workspaceSlug, query: ".ipynb", page: page } },
  );

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);

  const options = useMemo(() => {
    const lowercaseQuery = debouncedQuery.toLowerCase();

    return (
      data?.workspace?.bucket.objects.items.filter(
        (item: NotebookPickerOption) => {
          return item.name.toLowerCase().includes(lowercaseQuery);
        },
      ) ?? []
    );
  }, [data, debouncedQuery]);

  const displayValue = useCallback(
    (option: NotebookPickerOption) => (option ? option.name : ""),
    [],
  );

  const comboBoxValue = useMemo(() => {
    return (
      options.find(
        (option: NotebookPickerOption) => option.path === value?.path,
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
      {options.map((option: NotebookPickerOption) => (
        <Combobox.CheckOption key={option.key} value={option}>
          {option.name}
        </Combobox.CheckOption>
      ))}
    </Combobox>
  );
};

export default NotebooksPickerProps;
