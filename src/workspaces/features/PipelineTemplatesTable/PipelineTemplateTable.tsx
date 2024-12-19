import DataGrid, { BaseColumn } from "core/components/DataGrid";
import Button from "core/components/Button";
import SimplePagination from "core/components/Pagination/SimplePagination";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import DateColumn from "core/components/DataGrid/DateColumn";
import Spinner from "core/components/Spinner";
import Block from "core/components/Block";
import { useGetPipelineTemplatesQuery } from "./PipelineTemplateTable.generated";
import { gql } from "@apollo/client";

const PipelineTemplatesTable = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const perPage = 5;

  const { data, loading, error, fetchMore } = useGetPipelineTemplatesQuery({
    variables: { page, perPage },
  });

  if (error) return <p>{t("Error loading templates")}</p>;
  if (loading)
    return (
      <div className="flex items-center justify-center h-64 pt-8">
        <Spinner size={"xl"} />
      </div>
    );

  const { items, pageNumber, totalPages } = data?.pipelineTemplates || {
    items: [],
    pageNumber: 1,
    totalPages: 1,
  };

  const handlePageChange = (newPage: number) => {
    fetchMore({
      variables: { page: newPage, perPage },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
    setPage(newPage);
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
            {() => (
              <Button variant="secondary" size="sm">
                {t("Create pipeline")}
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
          }
        }
      }
    }
  `,
};

export default PipelineTemplatesTable;
