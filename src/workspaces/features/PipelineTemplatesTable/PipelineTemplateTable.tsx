import DataGrid, { BaseColumn } from "core/components/DataGrid";
import Button from "core/components/Button";
import { useTranslation } from "next-i18next";
import React, { useRef, useState } from "react";
import DateColumn from "core/components/DataGrid/DateColumn";
import Block from "core/components/Block";
import { gql } from "@apollo/client";
import useCacheKey from "core/hooks/useCacheKey";
import { useCreatePipelineFromTemplateVersionMutation } from "pipelines/graphql/mutations.generated";
import {
  PipelineTemplateTable_WorkspaceFragment,
  useGetPipelineTemplatesQuery,
} from "./PipelineTemplateTable.generated";
import { toast } from "react-toastify";
import router from "next/router";
import { CreatePipelineFromTemplateVersionError } from "graphql/types";
import SearchInput from "core/features/SearchInput";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Listbox from "core/components/Listbox";
import useDebounce from "core/hooks/useDebounce";

type PipelineTemplatesTableProps = {
  workspace: PipelineTemplateTable_WorkspaceFragment;
};

const PipelineTemplatesTable = ({ workspace }: PipelineTemplatesTableProps) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const perPage = 1;
  const clearCache = useCacheKey(["pipelines"]);
  const [createPipelineFromTemplateVersion] =
    useCreatePipelineFromTemplateVersionMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const options = [
    { id: 1, label: "All templates" },
    { id: 2, label: "From this workspace" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const { data, error, fetchMore } = useGetPipelineTemplatesQuery({
    variables: { page: 1, perPage, search: debouncedSearchQuery },
    fetchPolicy: "cache-and-network", // The template list is a global list across the instance, so we want to check the network for updates and show the cached data in the meantime
  });

  const fetchMoreData = (newPage: number = 1) =>
    fetchMore({
      variables: { page: newPage, perPage, search: searchQuery },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });

  if (error) return <p>{t("Error loading templates")}</p>;

  const { items, totalItems } = data?.pipelineTemplates ?? {
    items: [],
    totalItems: 0,
  };

  const createPipeline = (pipelineTemplateVersionId: string) => () => {
    createPipelineFromTemplateVersion({
      variables: {
        input: {
          pipelineTemplateVersionId: pipelineTemplateVersionId,
          workspaceSlug: workspace.slug,
        },
      },
    })
      .then((result) => {
        const success = result.data?.createPipelineFromTemplateVersion?.success;
        const errors = result.data?.createPipelineFromTemplateVersion?.errors;
        const pipeline =
          result.data?.createPipelineFromTemplateVersion?.pipeline;
        if (success && pipeline) {
          clearCache();
          router.push(
            `/workspaces/${encodeURIComponent(
              workspace.slug,
            )}/pipelines/${encodeURIComponent(pipeline.code)}`,
          );
          toast.success(
            t("Successfully created pipeline {{pipelineName}}", {
              pipelineName: pipeline.name,
            }),
          );
        } else if (
          errors?.includes(
            CreatePipelineFromTemplateVersionError.PermissionDenied,
          )
        ) {
          toast.error(t("You are not allowed to create a pipeline."));
        } else if (
          errors?.includes(
            CreatePipelineFromTemplateVersionError.PipelineAlreadyExists,
          )
        ) {
          toast.error(t("A pipeline with the same name already exists."));
        } else {
          toast.error(t("Unknown error : Failed to create pipeline"));
        }
      })
      .catch(() => {
        toast.error(t("Failed to create pipeline"));
      });
  };

  return (
    <div className={"max-w-4xl"}>
      <div className={"my-5 flex justify-between"}>
        <SearchInput
          ref={searchInputRef}
          onSubmit={(event) => event.preventDefault()}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value ?? "")}
          className="shadow-xs border-gray-50 w-96"
        />
        <Listbox
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
          by="id"
          getOptionLabel={(option) => option.label}
          className={"min-w-72"}
        />
      </div>
      <Block className="divide divide-y divide-gray-100 mt-4">
        <DataGrid
          data={items}
          defaultPageSize={perPage}
          totalItems={totalItems}
          fetchData={({ page }) => fetchMoreData(page)}
          fixedLayout={false}
        >
          <BaseColumn id="name" label={t("Name")}>
            {(value) => <span>{value.name}</span>}
          </BaseColumn>
          <BaseColumn id="description" label={t("Description")}>
            {(value) => <span>{value.description}</span>}
          </BaseColumn>
          <BaseColumn id="version" label={t("Version")}>
            {({ currentVersion: { versionNumber } }) => (
              <span>{`v${versionNumber}`}</span>
            )}
          </BaseColumn>
          <DateColumn
            accessor={"currentVersion.createdAt"}
            label={t("Created At")}
          />
          <BaseColumn id="actions" className={"text-right"}>
            {({
              currentVersion: {
                template: {
                  sourcePipeline: { name },
                },
                id,
              },
            }) => (
              <div className={"space-x-1"}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={createPipeline(id)}
                  leadingIcon={<PlusIcon className="h-4 w-4" />}
                >
                  {t("Create pipeline")}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={createPipeline(id)}
                  leadingIcon={<TrashIcon className="h-4 w-4" />}
                >
                  {t("Delete")}
                </Button>
              </div>
            )}
          </BaseColumn>
        </DataGrid>
      </Block>
    </div>
  );
};

const GET_PIPELINE_TEMPLATES = gql`
  query GetPipelineTemplates($page: Int!, $perPage: Int!, $search: String) {
    pipelineTemplates(page: $page, perPage: $perPage, search: $search) {
      pageNumber
      totalPages
      totalItems
      items {
        id
        name
        description
        currentVersion {
          id
          versionNumber
          createdAt
          template {
            sourcePipeline {
              name
            }
          }
        }
      }
    }
  }
`;

PipelineTemplatesTable.fragments = {
  workspace: gql`
    fragment PipelineTemplateTable_workspace on Workspace {
      slug
    }
  `,
};

export default PipelineTemplatesTable;
