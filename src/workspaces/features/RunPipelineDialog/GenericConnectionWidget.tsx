import { gql, useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import Select from "core/components/forms/Select";

type GenericConnectionWidgetProps = {
  parameter: any;
  value: string | null;
  onChange: (value: string | null) => void;
  workspaceSlug: string;
};

const GET_CONNECTION_METADATA = gql`
  query getConnectionBySlug(
    $workspaceSlug: String!
    $connectionSlug: String!
    $type: String!
  ) {
    connectionBySlug(
      workspaceSlug: $workspaceSlug
      connectionSlug: $connectionSlug
    ) {
      ... on DHIS2Connection {
        queryMetadata(type: $type) {
          items {
            id
            name
          }
          error
        }
      }
    }
  }
`;

const widgetToQueryType: { [key: string]: string } = {
  organisation_unit_picker: "ORGANISATION_UNITS",
  organisation_unit_group_picker: "ORGANISATION_UNIT_GROUPS",
  organisation_unit_level_picker: "ORGANISATION_UNIT_LEVELS",
  dataset_picker: "DATASETS",
  data_element_picker: "DATA_ELEMENTS",
  data_element_group_picker: "DATA_ELEMENT_GROUPS",
  indicator_picker: "INDICATORS",
  indicator_group_picker: "INDICATOR_GROUPS",
};

const GenericConnectionWidget = ({
  parameter,
  form,
  value,
  onChange,
  workspaceSlug,
}: GenericConnectionWidgetProps) => {
  console.log("Parameter", parameter);
  console.log("Form", form);
  const { data, loading, error } = useQuery(GET_CONNECTION_METADATA, {
    variables: {
      workspaceSlug,
      connectionSlug: form.formData[parameter.connection],
      type: "ORGANISATION_UNIT",
    },
    skip: !form.formData[parameter.connection],
  });

  // Convert API response into Select-compatible options
  const options = useMemo(() => {
    if (error) {
      console.error("Error fetching connection metadata:", error);
      return [];
    }
    return (
      data?.connectionBySlug?.queryMetadata?.items?.map(
        (item: { id: string; name: string }) => ({
          value: item.id,
          label: item.name,
        }),
      ) || []
    );
  }, [data, error]);

  return (
    <Select
      label="Select an option"
      loading={loading}
      options={options}
      placeholder="Select a value"
      required
      fullWidth
    />
  );
};

export default GenericConnectionWidget;
