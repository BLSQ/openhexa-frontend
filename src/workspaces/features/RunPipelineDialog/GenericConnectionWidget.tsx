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

const GenericConnectionWidget = ({
  parameter,
  value,
  onChange,
  workspaceSlug,
}: GenericConnectionWidgetProps) => {
  const { data, loading, error } = useQuery(GET_CONNECTION_METADATA, {
    variables: {
      workspaceSlug,
      connectionSlug: parameter.connection.slug,
      type: parameter.metadataType || "ORGANISATION_UNITS", // Adjust dynamically if needed
    },
    skip: !workspaceSlug || !parameter.connection?.slug,
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
