import { gql } from "@apollo/client";
import { BlockSection } from "core/components/Block";
import DataGrid from "core/components/DataGrid";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import React from "react";
import { useTranslation } from "react-i18next";
import { slugify } from "workspaces/helpers/connection";
import { ConnectionKeysSection_ConnectionFragment } from "./ConnectionKeysSection.generated";

type ConnectionKeysSectionProps = {
  connection: ConnectionKeysSection_ConnectionFragment;
};

const ConnectionKeysSection = (props: ConnectionKeysSectionProps) => {
  const { connection } = props;
  const { t } = useTranslation();

  return (
    <BlockSection
      collapsible={false}
      title={(open) => (
        <div className="flex flex-1 items-center justify-between">
          <h4 className="font-medium">{t("Environment variables ")}</h4>
        </div>
      )}
    >
      {connection.fields.length === 0 && (
        <span className="text-sm text-gray-500">
          {t("There are no environment variables for this connection yet.")}
        </span>
      )}

      {connection.fields.length > 0 && (
        <DataGrid
          data={connection.fields}
          fixedLayout={true}
          className="w-3/4 max-w-lg rounded-md border"
          defaultPageSize={5}
        >
          <TextColumn
            className="py-3 font-medium"
            label={t("Field")}
            accessor={"code"}
          />
          <TextColumn
            className="py-3 font-medium"
            label={t("Variable")}
            accessor={(value) => slugify(connection.slug, value.code)}
          />
        </DataGrid>
      )}
    </BlockSection>
  );
};

ConnectionKeysSection.fragments = {
  connection: gql`
    fragment ConnectionKeysSection_connection on Connection {
      slug
      fields {
        code
        value
      }
    }
  `,
};

export default ConnectionKeysSection;
