import { gql } from "@apollo/client";
import {
  Cog6ToothIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Checkbox from "core/components/forms/Checkbox";
import Field from "core/components/forms/Field";
import Link from "core/components/Link";
import Spinner from "core/components/Spinner";
import Title from "core/components/Title";
import useForm from "core/hooks/useForm";
import { WorkspaceConnectionType } from "graphql-types";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useCreateWorkspaceConnectionMutation } from "workspaces/graphql/mutations.generated";
import { TYPES } from "workspaces/helpers/connection";
import CreateConnectionDialog from ".";
import { CreateConnectionDialog_WorkspaceFragment } from "./CreateConnectionDialog.generated";

interface CreateConnectionDialogProps {
  open: boolean;
  onClose: () => void;
  workspace: CreateConnectionDialog_WorkspaceFragment;
}

const ConnectionTypePanel = ({
  onSelect,
}: {
  onSelect(type: string): void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <p>
        {t("You can create a connection based on our supported integrations")}
      </p>
      <div className="flex flex-wrap gap-6">
        {TYPES.filter((c) => c.value !== WorkspaceConnectionType.Custom).map(
          (connectionType, index) => (
            <button
              key={index}
              onClick={() => onSelect(connectionType.value)}
              className="border-1 flex h-24 w-32 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border border-gray-100 p-2 text-center shadow-md hover:border-gray-200 hover:bg-gray-100"
            >
              {connectionType.iconSrc && (
                <img src={connectionType.iconSrc} className="h-8 w-8" alt="" />
              )}
              <div className="text-sm">{connectionType.label}</div>
            </button>
          )
        )}
      </div>
      <p className="pt-4">{t("Or you can create a custom connection")}</p>
      <button
        onClick={() => onSelect(WorkspaceConnectionType.Custom)}
        className="border-1 flex h-24 w-32 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border border-gray-100 p-2 text-center shadow-md hover:border-gray-200 hover:bg-gray-100"
      >
        <Cog6ToothIcon className="h-16 w-16 text-gray-500" />
        <div className="text-sm">{t("Custom")}</div>
      </button>
    </div>
  );
};

type Form = {
  name: string;
  description?: string;
  slug?: string;
  type: WorkspaceConnectionType | null;
  fields: { secret?: boolean; name: string; value?: string }[];
};

export default function CreateCollectionDialog({
  open,
  onClose,
  workspace,
}: CreateConnectionDialogProps) {
  const { t } = useTranslation();
  const [createConnection] = useCreateWorkspaceConnectionMutation();
  const form = useForm<Form>({
    initialState: { type: null, fields: [] },
    async onSubmit(values) {
      console.log(values);
      const { data } = await createConnection({
        variables: {
          input: {
            name: values.name,
            type: values.type!,
            workspaceId: workspace.id,
          },
        },
      });
      console.log(data);
    },
  });

  const updateField = (index: number, values: any) => {
    const newFields = [...(form.formData.fields ?? [])];
    newFields.splice(index, 1, values);
    form.setFieldValue("fields", newFields);
  };

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      centered={false}
      maxWidth={form.formData.type ? "max-w-7xl" : "max-w-3xl"}
    >
      <Dialog.Title>{t("Create a connection")}</Dialog.Title>
      {form.formData.type ? (
        <Dialog.Content className="flex">
          <form className="grid flex-1 grid-cols-2 gap-x-2 gap-y-4">
            <Field
              onChange={form.handleInputChange}
              type="text"
              name="name"
              value={form.formData.name}
              label={t("Connection name")}
              placeholder={t("My connection")}
              required
            />
            <Field
              onChange={form.handleInputChange}
              name="slug"
              value={form.formData.slug}
              label={t("Slug")}
              placeholder={t("MY_CONNECTION")}
            />
            <Field
              onChange={form.handleInputChange}
              name="description"
              value={form.formData.description}
              className="col-span-2"
              label={t("Description")}
              help={t("Short description of the connection")}
              required
            />
            <div className="col-span-2 space-y-3">
              <Title level={5}>{t("Fields")}</Title>
              <div className="max-h-80 space-y-2 overflow-y-auto py-px px-px">
                {form.formData.fields!.map((field, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-end gap-2"
                  >
                    <Field
                      className="flex-1"
                      onChange={(event) =>
                        updateField(index, {
                          name: event.target.value,
                          value: field.value,
                        })
                      }
                      value={field.name}
                      name="name"
                      label={t("Name")}
                      required
                    />
                    <Field
                      name="value"
                      label={t("Value")}
                      onChange={(event) =>
                        updateField(index, {
                          value: event.target.value,
                          name: field.name,
                        })
                      }
                      value={field.value}
                      placeholder={t("Text value")}
                      required
                      className="flex-1"
                    />
                    <div className="mt-3 flex gap-2">
                      <Checkbox
                        id={`secret_${index}`}
                        className="mt-1"
                        name={`secret_${index}`}
                        onChange={(event) =>
                          updateField(index, {
                            ...field,
                            secret: event.target.checked,
                          })
                        }
                        checked={field.secret ?? false}
                        label={t("Secret")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          form.setFieldValue(
                            "fields",
                            form.formData.fields!.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="white"
                size="sm"
                type="button"
                onClick={() =>
                  form.setFieldValue("fields", [...form.formData.fields!, {}])
                }
                leadingIcon={<PlusCircleIcon className="h-4 w-4" />}
              >
                {t("Add a field")}
              </Button>
            </div>
          </form>
          <div className="ml-4 w-1/3 border-l-2 border-gray-100 pl-4">
            <Title level={4} className="">
              {t("Resources")}
            </Title>
            <p>Explanation of the parameters</p>
            <Link href="https://docs.openhexa.org">
              Link to the documentation
            </Link>
          </div>
        </Dialog.Content>
      ) : (
        <ConnectionTypePanel
          onSelect={(type) => form.setFieldValue("type", type)}
        />
      )}
      <Dialog.Actions>
        <Button type="button" variant="white" onClick={handleClose}>
          {t("Cancel")}
        </Button>
        {form.formData.type && (
          <Button
            onClick={(event) => form.handleSubmit(event)}
            disabled={!form.isValid || form.isSubmitting}
          >
            {form.isSubmitting && <Spinner size="xs" className="mr-1" />}
            {t("Create connection")}
          </Button>
        )}
      </Dialog.Actions>
    </Dialog>
  );
}

CreateCollectionDialog.fragments = {
  workspace: gql`
    fragment CreateConnectionDialog_workspace on Workspace {
      slug
    }
  `,
};
