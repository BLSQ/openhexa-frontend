import { gql, useQuery } from "@apollo/client";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import Button from "core/components/Button";
import SimplePagination from "core/components/Pagination/SimplePagination";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import DateColumn from "core/components/DataGrid/DateColumn";
import Spinner from "core/components/Spinner";
import Block from "core/components/Block";

export const PIPELINE_TEMPLATE_FRAGMENT = gql`
  fragment PipelineTemplateFragment on PipelineTemplate {
    id
    name
    currentVersion {
      id
      versionNumber
      createdAt
    }
  }
`;

export const GET_PIPELINE_TEMPLATES = gql`
  query GetPipelineTemplates($page: Int = 1, $perPage: Int = 15) {
    pipelineTemplates(page: $page, perPage: $perPage) {
      pageNumber
      totalPages
      totalItems
      items {
        ...PipelineTemplateFragment
      }
    }
  }
  ${PIPELINE_TEMPLATE_FRAGMENT}
`;

const PipelineTemplatesTable = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const perPage = 5;

  const { data, loading, error, fetchMore } = useQuery(GET_PIPELINE_TEMPLATES, {
    variables: { page, perPage },
  });

  if (error) return <p>{t("Error loading templates")}</p>;
  if (loading)
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

export default PipelineTemplatesTable;
