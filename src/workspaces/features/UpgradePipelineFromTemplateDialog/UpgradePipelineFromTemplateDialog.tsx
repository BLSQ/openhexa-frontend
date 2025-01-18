import { useTranslation } from "react-i18next";
import Button from "core/components/Button";
import React from "react";
import Dialog from "core/components/Dialog";
import Spinner from "core/components/Spinner";
import { gql } from "@apollo/client";
import {
  UpgradePipelineFromTemplateDialog_PipelineFragment,
  useGetAvailableUpgradePipelineTemplateVersionsQuery,
} from "./UpgradePipelineFromTemplateDialog.generated";
import MarkdownViewer from "core/components/MarkdownViewer";
import Block from "core/components/Block";

type UpgradePipelineFromTemplateDialogProps = {
  pipeline: UpgradePipelineFromTemplateDialog_PipelineFragment;
  open: boolean;
  onClose: () => void;
};

// TODO : on confirm call the upgrade endpoint

const UpgradePipelineFromTemplateDialog = ({
  pipeline: { id: pipelineId },
  open,
  onClose,
}: UpgradePipelineFromTemplateDialogProps) => {
  const { t } = useTranslation();

  const { data, loading } = useGetAvailableUpgradePipelineTemplateVersionsQuery(
    {
      variables: {
        pipelineId: pipelineId,
      },
      skip: !open,
    },
  );

  if (!open) return null;

  const loader = (
    <div className="inline-flex items-center">
      <Spinner size="xs" className="mr-2" />
      {t("Loading...")}
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{t("Upgrade to latest version")}</Dialog.Title>
      <Dialog.Content className={"w-300"}>
        {loading
          ? loader
          : data?.availableUpgradePipelineTemplateVersions
              .filter((version) => version.changelog)
              .map((version) => (
                <Block key={version.id} className={"my-2"}>
                  <Block.Header>Version {version.versionNumber}</Block.Header>
                  <Block.Content>
                    <MarkdownViewer>{version.changelog || ""}</MarkdownViewer>
                  </Block.Content>
                </Block>
              ))}
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="white" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button disabled={loading} type={"submit"}>
          {loading && <Spinner size="xs" className="mr-1" />}
          {t("Upgrade")}
        </Button>
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
