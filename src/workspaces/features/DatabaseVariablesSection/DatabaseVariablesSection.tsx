import { gql } from "@apollo/client";
import { DatabaseVariablesSection_WorkspaceFragment } from "./DatabaseVariablesSection.generated";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import { slugify } from "workspaces/helpers/connection";

type DatabaseVariablesSectionProps = {
  workspace: DatabaseVariablesSection_WorkspaceFragment;
};

const DatabaseVariablesSection = (props: DatabaseVariablesSectionProps) => {
  const { t } = useTranslation();
  const { database } = props.workspace;
  const credentials = useMemo(
    () => [
      {
        name: "db_name",
        value: database.name,
        secret: false,
      },
      {
        name: "username",
        value: database.name,
        secret: false,
      },
      {
        name: "password",
        value: database.password,
        secret: true,
      },
      {
        name: "port",
        value: database.port,
        secret: false,
      },
      {
        name: "host",
        value: database.host,
        secret: false,
      },
      {
        name: "external_url",
        value: database.externalUrl,
        secret: false,
      },
    ],
    [database]
  );
  return (
    <DataGrid
      className="max-2w-lg w-3/4 rounded-md border"
      data={credentials}
      fixedLayout={true}
    >
      <TextColumn className="py-3" label={t("Name")} accessor="name" />
      <BaseColumn label={t("Environment variable")} accessor="name">
        {(value) => (
          <code className="rounded-md bg-slate-100 p-1.5 font-mono text-xs font-medium text-gray-600">
            {slugify(`WORKSPACE_${value}`)}
          </code>
        )}
      </BaseColumn>
      <BaseColumn
        className="flex justify-start gap-x-2 text-gray-900"
        label={t("Value")}
      >
        {(field) => (
          <>
            {field.secret && <LockClosedIcon className="h-3 w-3" />}
            {field.secret && field.value && "*********"}
            {!field.secret && field.value}
          </>
        )}
      </BaseColumn>
    </DataGrid>
  );
};

DatabaseVariablesSection.fragment = {
  workspace: gql`
    fragment DatabaseVariablesSection_workspace on Workspace {
      slug
      database {
        name
        username
        password
        host
        port
        externalUrl
      }
    }
  `,
};

export default DatabaseVariablesSection;
