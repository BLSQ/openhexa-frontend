import { gql } from "@apollo/client";
import Button from "core/components/Button";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import Link from "core/components/Link";
import { useTranslation } from "next-i18next";
import {
  RunDatasetVersionsTable_RunFragment,
  RunDatasetVersions_WorkspaceFragment,
} from "./RunDatasetVersions.generated";
import { TextColumn } from "core/components/DataGrid/TextColumn";
import { DateTime } from "luxon";
import DateColumn from "core/components/DataGrid/DateColumn";

type RunDatasetVersionsTableProps = {
  run: RunDatasetVersionsTable_RunFragment;
  workspace: RunDatasetVersions_WorkspaceFragment;
};

const RunDatasetVersionsTable = (props: RunDatasetVersionsTableProps) => {
  const { run, workspace } = props;
  const { t } = useTranslation();

  if (!run.datasetVersions.length) {
    return null;
  }

  return (
    <DataGrid
      data={run.datasetVersions}
      defaultPageSize={run.datasetVersions.length}
      totalItems={run.datasetVersions.length}
      className="rounded-md border"
    >
      <TextColumn accessor={"name"} label={t("Name")} />
      <TextColumn accessor={"dataset.name"} label={t("Dataset")} />
      <DateColumn
        className="max-w-[50ch] py-3 "
        accessor="createdAt"
        id="createdAt"
        label={t("Created at")}
        format={DateTime.DATETIME_MED_WITH_SECONDS}
      />
      <BaseColumn className="text-right">
        {(item) => (
          <Link
            noStyle
            href={{
              pathname: "/workspaces/[workspaceSlug]/datasets/[dataset]",
              query: {
                workspaceSlug: workspace.slug,
                dataset: item.dataset.slug,
              },
            }}
          >
            <Button variant="outlined" size="sm">
              {t("View")}
            </Button>
          </Link>
        )}
      </BaseColumn>
    </DataGrid>
  );
};

RunDatasetVersionsTable.fragments = {
  workspace: gql`
    fragment RunDatasetVersions_workspace on Workspace {
      slug
    }
  `,

  run: gql`
    fragment RunDatasetVersionsTable_run on PipelineRun {
      datasetVersions {
        id
        name
        createdAt
        dataset {
          name
          slug
        }
      }
    }
  `,
};

export default RunDatasetVersionsTable;
