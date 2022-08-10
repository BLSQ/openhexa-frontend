import { gql, useLazyQuery } from "@apollo/client";
import Button from "core/components/Button";
import Dialog from "core/components/Dialog";
import Field from "core/components/forms/Field";
import Spinner from "core/components/Spinner";
import Switch from "core/components/Switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "core/components/Table";
import Tabs from "core/components/Tabs";
import CountryBadge from "core/features/CountryBadge";
import CountryPicker from "core/features/CountryPicker";
import { CountryPicker_CountryFragment } from "core/features/CountryPicker/CountryPicker.generated";
import useForm from "core/hooks/useForm";
import { Collection, CollectionElement } from "graphql-types";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import {
  ManageCollectionItemDialogQuery,
  ManageCollectionItemDialogQueryVariables,
} from "./ManageCollectionItemDialog.generated";

type ManageCollectionItemDialogProps = {
  onClose: () => void;
  open: boolean;
  element: { id: string; __typename: string };
};

type CollectionForm = {
  countries: CountryPicker_CountryFragment[] | null;
  name: string;
  tags: any[];
  removedFromCollections: string[];
  addToCollections: string[];
};

const ManageCollectionItemDialog = (props: ManageCollectionItemDialogProps) => {
  const { onClose, open, element } = props;
  const [currentTabIndex, setTabIndex] = useState(0);
  const [fetch, { data, loading }] = useLazyQuery<
    ManageCollectionItemDialogQuery,
    ManageCollectionItemDialogQueryVariables
  >(gql`
    query ManageCollectionItemDialog {
      collections {
        items {
          id
          name
          elements {
            items {
              id
              ... on S3ObjectCollectionElement {
                element {
                  id
                }
              }
              ... on DHIS2DataElementCollectionElement {
                element {
                  id
                }
              }
            }
          }
          countries {
            ...CountryBadge_country
          }
        }
      }
    }
    ${CountryBadge.fragments.country}
  `);

  useEffect(() => {
    if (open) {
      fetch();
    }
  }, [open, fetch]);

  const form = useForm<CollectionForm>({
    async onSubmit(values) {},
    initialState: {
      countries: [],
      name: "",
      addToCollections: [],
      removedFromCollections: [],
    },
  });
  const { t } = useTranslation();

  const onTabChange = useCallback(
    (index: number) => {
      form.resetForm();
      setTabIndex(index);
    },
    [setTabIndex, form]
  );

  const isElementInCollection = useCallback(
    (collection: any) => {
      if (form.formData.removedFromCollections?.includes(collection.id)) {
        return false;
      }
      if (form.formData.addToCollections?.includes(collection.id)) return true;
      return collection.elements.items.some(
        (collectionElement: any) => collectionElement.element.id === element.id
      );
    },
    [form, element.id]
  );

  if (!data?.collections || loading) {
    return (
      <Dialog maxWidth="max-w-2xl" open={open} onClose={onClose}>
        <Dialog.Title>{t("Manage collection")}</Dialog.Title>
        <Dialog.Content className="flex justify-center p-24">
          <Spinner />
        </Dialog.Content>
      </Dialog>
    );
  }

  const collections = data.collections.items;

  return (
    <Dialog maxWidth="max-w-2xl" open={open} onClose={onClose}>
      <Dialog.Title>{t("Manage collection")}</Dialog.Title>
      <Dialog.Content>
        <Tabs onChange={onTabChange}>
          <Tabs.Tab className="mt-4" label={t("Existing collections")}>
            <div>
              <Table className="table-fixed">
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell width="50%" className="font-semibold">
                        {collection.name}
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="justify-end">
                        <Switch checked={isElementInCollection(collection)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tabs.Tab>
          <Tabs.Tab className="mt-4" label={t("Create a collection")}>
            <form className="grid grid-cols-2 gap-2">
              <Field
                type="text"
                name="name"
                label={t("Collection name")}
                value={form.formData.name}
                onChange={form.handleInputChange}
                required
              />
              <Field
                type="text"
                name="name"
                label={t("Countries")}
                onChange={form.handleInputChange}
                required
              >
                <CountryPicker
                  withPortal
                  multiple
                  value={form.formData.countries ?? null}
                  required
                  onChange={(value) => form.setFieldValue("countries", value)}
                />
              </Field>
            </form>
          </Tabs.Tab>
        </Tabs>
      </Dialog.Content>
      <Dialog.Actions>
        <Button disabled={currentTabIndex === 1 ? !form.isValid : false}>
          {t("Done")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default ManageCollectionItemDialog;
