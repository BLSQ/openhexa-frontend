import React from "react";
import DHIS2Widget from "./DHIS2Widget";

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
  return (
    <DHIS2Widget
      parameter={parameter}
      form={form}
      workspaceSlug={workspaceSlug}
    />
  );
};

export default GenericConnectionWidget;
