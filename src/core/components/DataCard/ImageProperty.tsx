import React, { ChangeEvent } from "react";
import DataCard from "./DataCard";
import { useDataCardProperty } from "./context";
import { PropertyDefinition } from "./types";
import { useTranslation } from "next-i18next";

type ImagePropertyProps = PropertyDefinition & {
  className?: string;
  editButtonLabel?: string;
  placeholder?: string;
};

const ImageProperty = (props: ImagePropertyProps) => {
  const {
    className,
    placeholder = "/images/placeholder.svg",
    editButtonLabel,
    ...delegated
  } = props;
  const { property, section } = useDataCardProperty(delegated);
  const { t } = useTranslation();

  if (!property.visible) {
    return null;
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        property.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageSrc = property.formValue || property.displayValue || placeholder;

  if (section.isEdited && !property.readonly) {
    return (
      <DataCard.Property property={property}>
        <div className="flex items-center">
          {imageSrc && (
            <label htmlFor="file-upload" className="cursor-pointer">
              <img
                src={imageSrc}
                alt="Image Preview"
                className="h-12 w-12 rounded"
              />
            </label>
          )}
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 underline ml-3"
          >
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <span>{editButtonLabel ?? t("Edit")}</span>
          </label>
        </div>
      </DataCard.Property>
    );
  } else {
    return (
      <DataCard.Property property={property}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Image Preview"
            className="h-12 w-12 rounded"
          />
        )}
      </DataCard.Property>
    );
  }
};

export default ImageProperty;
