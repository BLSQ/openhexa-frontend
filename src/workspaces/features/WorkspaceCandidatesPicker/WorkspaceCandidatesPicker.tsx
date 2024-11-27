import { gql, useLazyQuery } from "@apollo/client";
import { Combobox as UICombobox } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import useDebounce from "core/hooks/useDebounce";
import { Combobox } from "core/components/forms/Combobox";
import { WorkspaceCandidatesQuery } from "workspaces/features/WorkspaceCandidatesPicker/WorkspaceCandidatesPicker.generated";

type Option = {
  displayName?: string;
  email?: string;
  hasAccount?: boolean;
};

type WorkspaceCandidatesPickerProps = {
  workspace: string;
  name: string;
  value?: Option | null;
  placeholder?: string;
  onChange(value?: Option | null): void;
  required?: boolean;
  disabled?: boolean;
};

const Classes = {
  Option: "p-2 text-gray-900 hover:bg-blue-500 hover:text-white",
};

const WorkspaceCandidatesPicker = (props: WorkspaceCandidatesPickerProps) => {
  const { value, workspace } = props;
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(value);
  const debouncedQuery = useDebounce(query, 150);
  const [fetch, { data, previousData, loading }] =
    useLazyQuery<WorkspaceCandidatesQuery>(WORKSPACE_CANDIDATES);

  const displayValue = (option: any) =>
    option?.displayName
      ? `${option.displayName} <${option.email}>`
      : option?.email || "";

  const onOpen = useCallback(() => {
    setQuery("");
  }, []);

  useEffect(() => {
    fetch({ variables: { query: debouncedQuery, workspace } });
  }, [fetch, debouncedQuery]);

  const users = (data ?? previousData)?.workspaceCandidates ?? {
    items: [],
  };

  return (
    <Combobox
      value={selected}
      onChange={(value) => {
        props.onChange(value);
        setSelected(value);
      }}
      onOpen={onOpen}
      displayValue={displayValue}
      loading={loading}
      placeholder={t("Search for a user...")}
      onInputChange={useCallback((event) => {
        setQuery(event.target.value);
      }, [])}
      onClose={useCallback(() => setQuery(""), [])}
    >
      <UICombobox.Option
        value={{ displayName: null, email: query, hasAccount: false }}
        className={clsx(!users.items.length && Classes.Option)}
      >
        {!users.items?.length && t("Send invite to... ") + query}
      </UICombobox.Option>

      {users.items.map((option) => (
        <Combobox.CheckOption
          key={option.email}
          value={{ ...option, ...{ hasAccount: true } }}
        >
          {`${option.displayName} <${option.email}>`}
        </Combobox.CheckOption>
      ))}
    </Combobox>
  );
};

WorkspaceCandidatesPicker.fragments = {
  value: gql`
    fragment WorkspaceCandidatesPicker_value on User {
      displayName
      email
    }
  `,
};

const WORKSPACE_CANDIDATES = gql`
  query WorkspaceCandidates($query: String!, $workspace: String!) {
    workspaceCandidates(query: $query, workspace: $workspace) {
      items {
        ...WorkspaceCandidatesPicker_value
      }
    }
  }
  ${WorkspaceCandidatesPicker.fragments.value}
`;

export default WorkspaceCandidatesPicker;
