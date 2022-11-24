import { Listbox } from "@headlessui/react";
import { ArrowRightIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import SearchInput from "catalog/features/SearchInput";
import SearchResult from "catalog/features/SearchResult";
import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import SimpleSelect from "core/components/forms/SimpleSelect";
import Title from "core/components/Title";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";

export enum ConnectionType {
  DHSI2 = "DHSI2",
  POSTGRESQL = "POSTGRESQL",
  GCP = "GCP",
}

interface CreateConnectionDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateCollectionDialog({
  open,
  onClose,
}: CreateConnectionDialogProps) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState();
  console.log(Object.values(ConnectionType));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="max-w-2xl"
      centered={false}
      padding="py-2"
      className="p-4"
    >
      <Dialog.Content className="h-1/2">
        <form className="space-y-5">
          <Field
            onChange={() => {}}
            type="text"
            name="name"
            label={t("Name")}
            required
          />
          <Field onChange={() => {}} name="slug" label={t("Slug")} required />
          <div>
            <label className="text-sm font-medium text-gray-600" htmlFor="type">
              Connection Type
            </label>
            <SimpleSelect
              id="type"
              className="form-select w-full rounded-md border border-gray-300 focus:border-blue-500  focus:ring-blue-500 sm:text-sm"
            >
              {Object.values(ConnectionType).map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </SimpleSelect>
          </div>
          <Field
            onChange={() => {}}
            name="excerpt"
            label={t("Excerpt")}
            required
          />
          <Field
            onChange={() => {}}
            name="description"
            label={t("Description")}
            required
          />
          <div className="space-y-5">
            <Title level={5}>Fields</Title>
            <div className="flex flex-row  space-x-5">
              <Field
                className="w-1/2"
                onChange={() => {}}
                name="key"
                label={t("Key")}
                required
              />
              <Field
                onChange={() => {}}
                name="value"
                label={t("Value")}
                required
                className="w-1/2"
              />
            </div>
            <Button>
              Add <PlusCircleIcon />
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}
