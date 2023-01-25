import { WorkspaceConnectionType } from "graphql-types";

export const TYPES = [
  {
    value: WorkspaceConnectionType.Postgresql,
    label: "PostgreSQL",
    color: "bg-blue-300",
    iconSrc: "/static/connector_postgresql/img/symbol.svg",
  },
  {
    value: WorkspaceConnectionType.S3,
    label: "Amazon S3 Bucket",
    color: "bg-orange-200",
    iconSrc: "/static/connector_s3/img/symbol.svg",
  },
  {
    value: WorkspaceConnectionType.Gcs,
    label: "Google Cloud Bucket",
    color: "bg-blue-200",
    iconSrc: "/static/connector_gcs/img/symbol.svg",
  },
  {
    value: WorkspaceConnectionType.Custom,
    label: "Custom",
    color: "bg-gray-200",
  },
  // {
  //   value: "dhis2",
  //   label: "DHIS2 Instance",
  //   iconSrc: "/static/connector_dhis2/img/symbol.svg",
  // },
];
