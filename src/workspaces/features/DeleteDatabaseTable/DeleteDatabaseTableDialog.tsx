import { gql } from "@apollo/client";

import { Trans, useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Button from "core/components/Button";
import Spinner from "core/components/Spinner";
import useCacheKey from "core/hooks/useCacheKey";
import { DeletePipelineVersionError, PipelineError } from "graphql-types";
import { useState, version } from "react";
import {
  useDeletePipelineMutation,
  useDeletePipelineVersionMutation,
  useDeleteWorkspaceDatabaseTableMutation,
} from "workspaces/graphql/mutations.generated";
import Dialog from "core/components/Dialog";
import {
  DatabaseTableDelete_DatabaseFragment,
  DatabaseTableDelete_WorkspaceFragment,
} from "./DeleteDatabaseTableDialog.generated";

type DeletePipelineDialogProps = {
  open: boolean;
  onClose: () => void;
  table: DatabaseTableDelete_DatabaseFragment;
  workspace: DatabaseTableDelete_WorkspaceFragment;
};

const DeleteDatabaseTableDialog = (props: DeletePipelineDialogProps) => {
  const { t } = useTranslation();
  const { open, onClose, table, workspace } = props;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteDatabaseTable] = useDeleteWorkspaceDatabaseTableMutation();

  const onSubmit = async () => {
    setIsSubmitting(true);
    const { data } = await deleteDatabaseTable({
      variables: {
        input: {
          workspaceSlug: workspace.slug,
          table: table.name,
        },
      },
    });

    if (!data?.deleteWorkspaceDatabaseTable) {
      throw new Error("Unknown error.");
    }

    if (data.deleteWorkspaceDatabaseTable.success) {
      setIsSubmitting(false);
      router.push({
        pathname: "/workspaces/[workspaceSlug]/databases",
        query: { workspaceSlug: workspace.slug },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{t("Delete table")}</Dialog.Title>
      <Dialog.Content className="space-y-4">
        <p>
          <Trans>
            Are you sure you want to delete table <b>{table.name}</b> ?
          </Trans>
        </p>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" type="button" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button onClick={onSubmit}>
          {isSubmitting && <Spinner size="xs" className="mr-1" />}
          {t("Delete")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

DeleteDatabaseTableDialog.fragment = {
  table: gql`
    fragment DatabaseTableDelete_database on DatabaseTable {
      name
    }
  `,
  workspace: gql`
    fragment DatabaseTableDelete_workspace on Workspace {
      slug
    }
  `,
};

export default DeleteDatabaseTableDialog;
