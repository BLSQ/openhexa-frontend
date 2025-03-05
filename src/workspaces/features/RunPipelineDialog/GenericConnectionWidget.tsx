import React from "react";
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
};

export default GenericConnectionWidget;
