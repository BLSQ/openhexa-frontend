import { Portal } from "@headlessui/react";
import { useListener } from "core/hooks/useEmitter";
import { useState } from "react";
import Alert from "./Alert";

const AlertManager = () => {
  const [alert, setAlert] = useState<null | {
    message: string;
    type?: "error" | "info" | "warning";
  }>();

  useListener("displayAlert", (event) => {
    setAlert(event.detail);
  });

  if (!alert) return null;
  return (
    <Portal>
      <Alert icon={alert.type ?? "info"} onClose={() => setAlert(null)}>
        <p>{alert.message}</p>
      </Alert>
    </Portal>
  );
};

export default AlertManager;
