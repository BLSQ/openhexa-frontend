import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Button from "./Button/Button";
import Dialog from "./Dialog";

export enum AlertType {
  success,
  error,
  info,
  warning,
}

type AlertProps = {
  type?: AlertType;
  onClose: () => void;
  children: ReactNode;
};

const Alert = ({ type, children, onClose }: AlertProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) setOpen(true);
  }, [open]);

  const icon = useMemo(() => {
    switch (type) {
      case AlertType.error:
        return <XCircleIcon className="h-16 w-16 text-red-400" />;
      case AlertType.warning:
        return <ExclamationCircleIcon className="h-16 w-16 text-amber-400" />;
      case AlertType.success:
        return <CheckCircleIcon className="h-16 w-16 text-green-400" />;
      case AlertType.info:
      default:
        return <InformationCircleIcon className="h-16 w-16 text-picton-blue" />;
    }
  }, [type]);

  return (
    <Dialog onClose={onClose} open={open}>
      <Dialog.Content className="flex items-center gap-4">
        {icon}
        <div className="flex-1">{children}</div>
        <Button variant="white" onClick={onClose}>
          {t("Close")}
        </Button>
      </Dialog.Content>
    </Dialog>
  );
};

const createAlert = (type: AlertType) => {
  return function GenericAlert({
    children,
    ...otherProps
  }: Omit<AlertProps, "type">) {
    return (
      <Alert {...otherProps} type={type}>
        {children}
      </Alert>
    );
  };
};
export const ErrorAlert = createAlert(AlertType.error);
export const WarningAlert = createAlert(AlertType.warning);
export const SuccessAlert = createAlert(AlertType.success);
export const InfoAlert = createAlert(AlertType.info);
