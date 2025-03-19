import { Description, Field } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import { DHIS2Widget, dhis2WidgetToQuery } from "./DHIS2Widget";

type GenericConnectionWidgetProps = {
  parameter: any;
  connection: string;
  widget: string;
  form: any;
  workspaceSlug: string;
};

const GenericConnectionWidget = ({
  parameter,
  connection,
  widget,
  form,
  workspaceSlug,
}: GenericConnectionWidgetProps) => {
  const { t } = useTranslation();
  if (parameter.widget in dhis2WidgetToQuery) {
    return (
      <DHIS2Widget
        parameter={parameter}
        connection={connection}
        widget={widget}
        form={form}
        workspaceSlug={workspaceSlug}
      />
    );
  }
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Description className="text-sm/6  text-red-400">
          {t("Widget {{widget}} was not found", { widget: widget })}
        </Description>
      </Field>
    </div>
  );
};

export default GenericConnectionWidget;
