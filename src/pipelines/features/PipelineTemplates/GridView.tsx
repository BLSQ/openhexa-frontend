import React, { useState } from "react";
import DataGrid, { BaseColumn } from "core/components/DataGrid";
import DateColumn from "core/components/DataGrid/DateColumn";
import Block from "core/components/Block";
import Button from "core/components/Button";
import { useTranslation } from "next-i18next";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "core/components/Link";
import DeleteTemplateDialog from "pipelines/features/DeleteTemplateDialog";

type GridViewProps = {
  items: any[];
  workspace: any;
  page: number;
  perPage: number;
  totalItems: number;
  createPipeline: (pipelineTemplateVersionId: string) => () => void;
  setPage: (page: number) => void;
};

const GridView = ({
  items,
  workspace,
  perPage,
  totalItems,
  createPipeline,
  setPage,
}: GridViewProps) => {
  const { t } = useTranslation();
  const [templateToDelete, setTemplateToDelete] = useState<any | null>(null);

  return (
    <Block className="divide divide-y divide-gray-100 mt-4">
      <DataGrid
        data={items}
        defaultPageSize={perPage}
        totalItems={totalItems}
        fetchData={({ page }) => setPage(page)}
        fixedLayout={false}
      >
        <BaseColumn id="name" label={t("Name")}>
          {(template) => (
            <Link
              href={`/workspaces/${encodeURIComponent(workspace.slug)}/templates/${template.code}`}
            >
              {template.name}
            </Link>
          )}
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
      {templateToDelete && (
        <DeleteTemplateDialog
          open={true}
          pipelineTemplate={templateToDelete}
          onClose={() => setTemplateToDelete(null)}
        />
      )}
    </Block>
  );
};

export default GridView;
