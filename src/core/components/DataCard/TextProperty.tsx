import clsx from "clsx";
import MarkdownViewer from "../MarkdownViewer";
import Input from "../forms/Input";
import Textarea from "../forms/Textarea";
import DataCard from "./DataCard";
import { useDataCardProperty } from "./context";
import { PropertyDefinition } from "./types";

type TextPropertyProps = PropertyDefinition & {
  markdown?: boolean;
  defaultValue?: string;
  className?: string;
  sm?: boolean;
};

const TextProperty = (props: TextPropertyProps) => {
  const { className, markdown, sm = false, ...delegated } = props;

  const { property, section } = useDataCardProperty(delegated);

  if (!property.visible) {
    return null;
  }

  if (section.isEdited && !property.readonly) {
    return (
      <DataCard.Property property={property}>
        {markdown ? (
          <Textarea
            className="w-full"
            value={property.formValue}
            onChange={(e) => property.setValue(e.target.value)}
            required={property.required}
            readOnly={property.readonly}
          />
        ) : (
          <Input
            value={property.formValue ?? ""}
            onChange={(e) => property.setValue(e.target.value)}
            required={property.required}
            readOnly={property.readonly}
          />
        )}
      </DataCard.Property>
    );
  } else {
    return (
      <DataCard.Property property={property}>
        {markdown && property.displayValue ? (
          <MarkdownViewer sm={sm}>{property.displayValue}</MarkdownViewer>
        ) : (
          <div className={clsx("prose text-sm text-gray-900", className)}>
            {property.displayValue ?? property.defaultValue}
          </div>
        )}
      </DataCard.Property>
    );
  }
};

export default TextProperty;
