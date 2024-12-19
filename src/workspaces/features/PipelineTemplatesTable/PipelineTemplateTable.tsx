import { gql, useQuery } from "@apollo/client";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import DateColumn from "core/components/DataGrid/DateColumn";
import Button from "core/components/Button";
import Spinner from "core/components/Spinner";
import SimplePagination from "core/components/Pagination/SimplePagination";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export const PIPELINE_TEMPLATE_FRAGMENT = gql`
  fragment PipelineTemplateFragment on PipelineTemplate {
    id
    name
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
  const perPage = 15;

  const { data, loading, error, fetchMore } = useQuery(GET_PIPELINE_TEMPLATES, {
    variables: { page, perPage },
  });

  if (loading) return <Spinner />;
  if (error) return <p>{t("Error loading templates")}</p>;

  const { items, pageNumber, totalPages } = data.pipelineTemplates;

  const handlePageChange = (newPage: number) => {
    fetchMore({
      variables: { page: newPage, perPage },
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    }).then(() => setPage(newPage));
  };

  return (
    <>
      <DataGrid data={items} defaultPageSize={perPage} fixedLayout={false}>
        <BaseColumn id="name" label={t("Name")}>
          {(value) => <span>{value.name}</span>}
        </BaseColumn>
        <DateColumn accessor={"createdAt"} label={t("Created at")} />
        <BaseColumn id="actions">
          {(value) => (
            <Button variant="outlined" size="sm">
              {t("Action")}
            </Button>
          )}
        </BaseColumn>
      </DataGrid>
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
