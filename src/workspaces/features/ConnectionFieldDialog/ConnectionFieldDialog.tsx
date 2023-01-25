import Dialog from "core/components/Dialog";
import { useTranslation } from "react-i18next";

type ConnectionFieldDialogProps = {
  onClose(): void;
  open: boolean;
};

const ConnectionFieldDialog = (props: ConnectionFieldDialogProps) => {
  const { onClose, open } = props;
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Title>{t("Update your field")}</Dialog.Title>
      <Dialog.Content>coucou</Dialog.Content>
    </Dialog>
  );
};

export default ConnectionFieldDialog;
