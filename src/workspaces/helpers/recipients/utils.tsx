import Button from "core/components/Button";
import Select from "core/components/forms/Select";
import { PipelineNotificationLevel } from "graphql/types";
import { i18n } from "next-i18next";
import { ReactElement, ReactNode } from "react";

export const formatNotificationLevel = (level: PipelineNotificationLevel) => {
  switch (level) {
    case PipelineNotificationLevel.All:
      return i18n!.t("All");
    case PipelineNotificationLevel.Error:
      return i18n!.t("Error");
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

export const NotificationLevelSelect = ({
  value,
  onChange,
}: {
  value?: PipelineNotificationLevel | null | undefined;
  onChange: (notificationLevel: PipelineNotificationLevel) => void;
}) => {
  return (
    <Select
      value={value || null}
      displayValue={(value) => formatNotificationLevel(value)}
      placeholder={i18n!.t("Select notification level")}
      onChange={onChange}
      getOptionLabel={(option) => formatNotificationLevel(option)}
      options={[PipelineNotificationLevel.All, PipelineNotificationLevel.Error]}
    />
  );
};
