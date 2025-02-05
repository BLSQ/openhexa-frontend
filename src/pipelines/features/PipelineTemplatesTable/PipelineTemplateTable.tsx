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
import DeleteTemplateDialog from "pipelines/features/DeleteTemplateDialog";
import { PipelineTemplateDialog_PipelineTemplateFragment } from "pipelines/features/DeleteTemplateDialog/DeleteTemplateDialog.generated";
import TemplateCard from "workspaces/features/TemplateCard";
import Pagination from "core/components/Pagination";

type PipelineTemplatesTableProps = {
  workspace: PipelineTemplateTable_WorkspaceFragment;
};

const PipelineTemplatesTable = ({ workspace }: PipelineTemplatesTableProps) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [templateToDelete, setTemplateToDelete] =
    useState<PipelineTemplateDialog_PipelineTemplateFragment | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 2;
  const clearCache = useCacheKey(["pipelines"]);

  const [createPipelineFromTemplateVersion] =
    useCreatePipelineFromTemplateVersionMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const workspaceFilterOptions = [
    { id: 1, label: "All templates", workspaceSlug: "" },
    { id: 2, label: "From this workspace", workspaceSlug: workspace.slug },
  ];
  const [workspaceFilter, setWorkspaceFilter] = useState(
    workspaceFilterOptions[0],
  );

  const { data, error, refetch } = useGetPipelineTemplatesQuery({
    variables: {
      page,
      perPage,
      search: debouncedSearchQuery,
      workspaceSlug: workspaceFilter.workspaceSlug,
    },
    fetchPolicy: "cache-and-network", // The template list is a global list across the instance, so we want to check the network for updates and show the cached data in the meantime
  });

  useCacheKey("templates", () => refetch());

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
          value={workspaceFilter}
          onChange={setWorkspaceFilter}
          options={workspaceFilterOptions}
          by="id"
          getOptionLabel={(option) => option.label}
          className={"min-w-72"}
        />
      </div>
      {1 === 1 ? (
        <>
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div>{t("No template to show")}</div>
            </div>
          ) : (
            <>
              <div className="mt-5 mb-3 grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-5">
                {items.map((template, index) => (
                  <TemplateCard
                    workspace={workspace}
                    key={index}
                    template={template}
                  />
                ))}
              </div>
              <Pagination
                onChange={(page) => setPage(page)}
                page={page}
                perPage={perPage}
                totalItems={totalItems}
                countItems={items.length}
              />
            </>
          )}
        </>
      ) : (
        <Block className="divide divide-y divide-gray-100 mt-4">
          <DataGrid
            data={items}
            defaultPageSize={perPage}
            totalItems={totalItems}
            fetchData={({ page }) => setPage(page)}
            fixedLayout={false}
          >
            <BaseColumn id="name" label={t("Name")}>
              {(value) => <span>{value.name}</span>}
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
              {(template) => {
                const {
                  permissions: { delete: canDelete },
                  currentVersion: { id: pipelineId },
                } = template;
                return (
                  <div className={"space-x-1"}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={createPipeline(pipelineId)}
                      leadingIcon={<PlusIcon className="h-4 w-4" />}
                    >
                      {t("Create pipeline")}
                    </Button>
                    {canDelete && (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setTemplateToDelete(template)}
                          leadingIcon={<TrashIcon className="h-4 w-4" />}
                        >
                          {t("Delete")}
                        </Button>
                      </>
                    )}
                  </div>
                );
              }}
            </BaseColumn>
          </DataGrid>
        </Block>
      )}
      {templateToDelete && (
        <DeleteTemplateDialog
          open={true}
          pipelineTemplate={templateToDelete}
          onClose={() => setTemplateToDelete(null)}
        />
      )}
    </div>
  );
};

const GET_PIPELINE_TEMPLATES = gql`
  query GetPipelineTemplates(
    $page: Int!
    $perPage: Int!
    $search: String
    $workspaceSlug: String
  ) {
    pipelineTemplates(
      page: $page
      perPage: $perPage
      search: $search
      workspaceSlug: $workspaceSlug
    ) {
      pageNumber
      totalPages
      totalItems
      items {
        id
        code
        name
        permissions {
          delete
        }
        currentVersion {
          id
          versionNumber
          createdAt
          user {
            ...User_user
          }
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
