import React from "react";
import { DHIS2Widget, dhis2WidgetToQuery } from "./DHIS2Widget";

type GenericConnectionWidgetProps<T> = {
  parameter: any;
  form: any;
  workspaceSlug: string;
};

const GenericConnectionWidget = <T,>({
  parameter,
  form,
  workspaceSlug,
}: GenericConnectionWidgetProps<T>) => {
  if (parameter.widget in dhis2WidgetToQuery) {
    return (
      <DHIS2Widget
        parameter={parameter}
        form={form}
        workspaceSlug={workspaceSlug}
      />
    );
  }
};

export default GenericConnectionWidget;
