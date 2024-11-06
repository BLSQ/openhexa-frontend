import Button from "core/components/Button";
import Select from "core/components/forms/Select";
import { PipelineNotificationEvent } from "graphql/types";
import { i18n } from "next-i18next";
import { ReactElement, ReactNode } from "react";

export const formatNotificationEvent = (status: PipelineNotificationEvent) => {
  switch (status) {
    case PipelineNotificationEvent.AllEvents:
      return i18n!.t("All events");
    case PipelineNotificationEvent.PipelineFailed:
      return i18n!.t("Pipeline failed");
  }
};

interface IActionButton {
  icon?: ReactElement;
  onClick?: () => void;
  disabled?: boolean;
  render?: () => ReactNode;
}
interface ActionButtonGroupProps {
  buttons: IActionButton[];
}

export const ActionButtonGroup = ({ buttons }: ActionButtonGroupProps) => {
  return (
    <div className="flex gap-2">
      {buttons.map((button: IActionButton, index) =>
        button.render ? (
          <div key={index}>{button.render()}</div>
        ) : (
          <Button
            key={index}
            onClick={button.onClick}
            size="sm"
            variant="secondary"
            disabled={button.disabled}
          >
            {button.icon}
          </Button>
        ),
      )}
    </div>
  );
};

export const NotificationEventSelect = ({
  value,
  onChange,
}: {
  value?: PipelineNotificationEvent | null | undefined;
  onChange: (notificationEvent: PipelineNotificationEvent) => void;
}) => {
  return (
    <Select
      value={value || null}
      displayValue={(value) => formatNotificationEvent(value)}
      placeholder={i18n!.t("Select event")}
      onChange={onChange}
      getOptionLabel={(option) => formatNotificationEvent(option)}
      options={[
        PipelineNotificationEvent.AllEvents,
        PipelineNotificationEvent.PipelineFailed,
      ]}
    />
  );
};
