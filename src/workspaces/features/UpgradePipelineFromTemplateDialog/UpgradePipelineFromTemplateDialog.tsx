import { useTranslation } from "react-i18next";
import Button from "core/components/Button";
import React, { useState } from "react";
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
import { useUpgradePipelineVersionFromTemplateMutation } from "../../graphql/mutations.generated";
import { toast } from "react-toastify";

type UpgradePipelineFromTemplateDialogProps = {
  pipeline: UpgradePipelineFromTemplateDialog_PipelineFragment;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const UpgradePipelineFromTemplateDialog = ({
  pipeline: { id: pipelineId },
  open,
  onClose,
  onSuccess,
}: UpgradePipelineFromTemplateDialogProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading } = useGetAvailableUpgradePipelineTemplateVersionsQuery(
    {
      variables: {
        pipelineId: pipelineId,
      },
      skip: !open,
    },
  );

  const [upgradePipeline] = useUpgradePipelineVersionFromTemplateMutation();

  if (!open) return null;

  const onSubmit = async () => {
    setIsSubmitting(true);
    const { data } = await upgradePipeline({
      variables: {
        input: {
          pipelineId,
        },
      },
    });
    if (!data?.upgradePipelineVersionFromTemplate) {
      toast.error(t("Unknown error upgrading pipeline"));
    }
    if (data?.upgradePipelineVersionFromTemplate.success) {
      onSuccess();
      toast.success(t("Pipeline upgraded successfully"));
      onClose();
    } else {
      toast.error(t("Error upgrading pipeline"));
    }
    setIsSubmitting(false);
  };

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
        <Button
          disabled={loading || isSubmitting}
          type={"submit"}
          onClick={onSubmit}
        >
          {isSubmitting && <Spinner size="xs" className="mr-1" />}
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
      code
    }
  `,
};

export default UpgradePipelineFromTemplateDialog;
