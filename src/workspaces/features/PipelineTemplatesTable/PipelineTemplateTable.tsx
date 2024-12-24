import DataGrid, { BaseColumn } from "core/components/DataGrid";
import Button from "core/components/Button";
import SimplePagination from "core/components/Pagination/SimplePagination";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import DateColumn from "core/components/DataGrid/DateColumn";
import Spinner from "core/components/Spinner";
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

type PipelineTemplatesTableProps = {
  workspace: PipelineTemplateTable_WorkspaceFragment;
};

const PipelineTemplatesTable = ({ workspace }: PipelineTemplatesTableProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const perPage = 5;
  const clearCache = useCacheKey(["pipelines"]);
  const [createPipelineFromTemplateVersion] =
    useCreatePipelineFromTemplateVersionMutation();

  const { data, loading, error, fetchMore } = useGetPipelineTemplatesQuery({
    variables: { page, perPage },
  });

  if (error) return <p>{t("Error loading templates")}</p>;
  if (!data || loading)
    return (
      <div className="flex items-center justify-center h-64 pt-8">
        <Spinner size={"xl"} />
      </div>
    );

  const { items, pageNumber, totalPages } = data.pipelineTemplates;

  const handlePageChange = (newPage: number) => {
    fetchMore({
      variables: { page: newPage, perPage },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
    setPage(newPage);
  };

  // TODO : extract names
  // TODO : test calling the mutation
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
            )}/pipelines/${encodeURIComponent(pipeline.id)}`,
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
    <>
      <Block className="divide divide-y divide-gray-100 mt-10">
        <DataGrid data={items} defaultPageSize={perPage} fixedLayout={false}>
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
          <BaseColumn id="actions">
            {({
              currentVersion: {
                template: {
                  sourcePipeline: { name },
                },
                id,
              },
            }) => (
              <Button
                variant="secondary"
                size="sm"
                onClick={createPipeline(id)}
              >
                {t("Create pipeline {{pipelineName}}", {
                  pipelineName: name,
                })}
              </Button>
            )}
          </BaseColumn>
        </DataGrid>
      </Block>
      <SimplePagination
        hasNextPage={pageNumber < totalPages}
        hasPreviousPage={pageNumber > 1}
        page={pageNumber}
        onChange={handlePageChange}
      />
    </>
  );
};

PipelineTemplatesTable.fragments = {
  getPipelineTemplates: gql`
    query GetPipelineTemplates($page: Int!, $perPage: Int!) {
      pipelineTemplates(page: $page, perPage: $perPage) {
        pageNumber
        totalPages
        totalItems
        items {
          id
          name
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
  `,
  workspace: gql`
    fragment PipelineTemplateTable_workspace on Workspace {
      slug
    }
  `,
};

export default PipelineTemplatesTable;
