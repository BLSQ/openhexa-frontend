import Dialog from "core/components/Dialog";
import { useTranslation } from "next-i18next";

type CreateCollectionDialogProps = {
  onClose: () => void;
  open: boolean;
};

const CreateCollectionDialog = (props: CreateCollectionDialogProps) => {
  const { onClose, open } = props;
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{t("Create a collection")}</Dialog.Title>
      <Dialog.Content>test</Dialog.Content>
    </Dialog>
  );
};

export default CreateCollectionDialog;
