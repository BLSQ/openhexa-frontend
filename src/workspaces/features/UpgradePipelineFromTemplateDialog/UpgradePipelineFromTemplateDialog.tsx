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
import Time from "core/components/Time";

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
      <Dialog.Title>{t("Upgrade to latest template version")}</Dialog.Title>
      <Dialog.Content className={"w-300"}>
        {loading
          ? loader
          : data?.availableUpgradePipelineTemplateVersions.map((version) => (
              <Block
                key={version.id}
                className="mb-2 border rounded-md shadow-sm"
              >
                <Block.Header className="flex justify-start">
                  <div className="font-bold text-lg">
                    {t("Version")} {version.versionNumber}
                  </div>
                  <div className="text-gray-500 ml-1 mt-1 text-sm">
                    ({t("published")}{" "}
                    <Time relative datetime={version.createdAt} />)
                  </div>
                </Block.Header>
                {version.changelog && (
                  <Block.Content className="text-sm">
                    <MarkdownViewer sm={true}>
                      {version.changelog}
                    </MarkdownViewer>
                  </Block.Content>
                )}
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
      createdAt
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
