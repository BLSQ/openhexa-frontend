import { useTranslation } from "react-i18next";
import Button from "core/components/Button";
import React from "react";
import Dialog from "core/components/Dialog";
import { gql } from "@apollo/client";
import {
  UpgradePipelineFromTemplateDialog_PipelineFragment,
  useGetAvailableUpgradePipelineTemplateVersionsQuery,
} from "./UpgradePipelineFromTemplateDialog.generated";

type UpgradePipelineFromTemplateDialogProps = {
  pipeline: UpgradePipelineFromTemplateDialog_PipelineFragment;
  open: boolean;
  onClose: () => void;
};

// TODO : on confirm call the upgrade endpoint
// TODO : loader
// TODO : log time

const UpgradePipelineFromTemplateDialog = ({
  pipeline: { id: pipelineId },
  open,
  onClose,
}: UpgradePipelineFromTemplateDialogProps) => {
  const { t } = useTranslation();

  const { data, loading, error } =
    useGetAvailableUpgradePipelineTemplateVersionsQuery({
      variables: {
        pipelineId: pipelineId,
      },
    });

  return (
    <Dialog open={open} onClose={onClose} className={"w-300"}>
      <Dialog.Title>Upgrade</Dialog.Title>
      <Dialog.Content className={"w-300"}>
        {data?.availableUpgradePipelineTemplateVersions.map((version) => (
          <p key={version.id}>
            {version.versionNumber}
            {version.changelog}
          </p>
        ))}
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button type={"submit"}>{t("Upgrade")}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const GET_AVAILABLE_TEMPLATE_VERSIONS = gql`
  query GetAvailableUpgradePipelineTemplateVersions($pipelineId: UUID!) {
    availableUpgradePipelineTemplateVersions(pipelineId: $pipelineId) {
      id
      versionNumber
      changelog
    }
  }
`;

UpgradePipelineFromTemplateDialog.fragments = {
  pipeline: gql`
    fragment UpgradePipelineFromTemplateDialog_pipeline on Pipeline {
      id
    }
  `,
};

export default UpgradePipelineFromTemplateDialog;
