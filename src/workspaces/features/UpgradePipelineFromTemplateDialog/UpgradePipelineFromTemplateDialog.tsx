import { useTranslation } from "react-i18next";
import Button from "core/components/Button";
import React from "react";
import Dialog from "core/components/Dialog";

type UpgradePipelineFromTemplateDialogProps = {
  open: boolean;
  onClose: () => void;
};

const UpgradePipelineFromTemplateDialog = ({
  open,
  onClose,
}: UpgradePipelineFromTemplateDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} className={"w-300"}>
      <Dialog.Title>Upgrade</Dialog.Title>
      <Dialog.Content className={"w-300"}>
        <p>Changelog</p>
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

export default UpgradePipelineFromTemplateDialog;
