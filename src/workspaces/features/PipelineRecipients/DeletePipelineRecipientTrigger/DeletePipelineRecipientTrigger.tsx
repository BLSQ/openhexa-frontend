import { gql } from "@apollo/client";
import useCacheKey from "core/hooks/useCacheKey";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { deletePipelineRecipient } from "workspaces/helpers/pipelines";
import { DeletePipelineRecipientTrigger_RecipientFragment } from "./DeletePipelineRecipientTrigger.generated";

type DeletePipelineRecipientriggerProps = {
  children: ({ onClick }: { onClick: () => void }) => ReactElement;
  confirmMessage?: string;
  recipient: DeletePipelineRecipientTrigger_RecipientFragment;
};

const DeletePipelineRecipientTrigger = (
  props: DeletePipelineRecipientriggerProps,
) => {
  const { t } = useTranslation();
  const {
    children,
    recipient,
    confirmMessage = t("Remove {{name}} from the notifications recipients?", {
      name: recipient.user.displayName,
    }),
  } = props;

  const clearCache = useCacheKey(["pipelines", recipient.pipeline.id]);

  const onClick = async () => {
    if (window.confirm(confirmMessage)) {
      await deletePipelineRecipient(recipient.id);
      clearCache();
    }
  };
  if (!recipient.pipeline.permissions.update) {
    return null;
  }
  return children({ onClick });
};

DeletePipelineRecipientTrigger.fragments = {
  recipient: gql`
    fragment DeletePipelineRecipientTrigger_recipient on PipelineRecipient {
      id
      user {
        displayName
      }
      pipeline {
        id
        permissions {
          update
        }
      }
    }
  `,
};

export default DeletePipelineRecipientTrigger;
