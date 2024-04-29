import { gql, useQuery } from "@apollo/client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Popover from "core/components/Popover";
import Input from "core/components/forms/Input";
import {
  BucketObject,
  BucketObjectPage,
  BucketObjectType,
} from "graphql-types";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import {
  BucketObjectPicker_WorkspaceFragment,
  ObjectPickerQuery,
  ObjectPickerQueryResult,
  ObjectPickerQueryVariables,
} from "./BucketObjectPicker.generated";

type BucketObjectPickerProps = {
  workspace: BucketObjectPicker_WorkspaceFragment;
  placeholder?: string;
  value: string | null;
};

const BucketObjectPicker = (props: BucketObjectPickerProps) => {
  const { t } = useTranslation();
  const { workspace, value, placeholder = t("Select an object") } = props;
  const [items, setItems] = useState<BucketObject[]>([]);
  const { data, loading } = useQuery<
    ObjectPickerQuery,
    ObjectPickerQueryVariables
  >(
    gql`
      query ObjectPicker($slug: String!, $page: Int, $perPage: Int) {
        workspace(slug: $slug) {
          slug
          bucket {
            objects(page: $page, perPage: $perPage) {
              items {
                name
                key
                path
                type
              }
              hasNextPage
            }
          }
        }
      }
    `,
    {
      variables: {
        slug: workspace.slug,
        page: 1,
        perPage: 15,
      },
    },
  );

  console.log(data);

  useEffect(() => {
    if (data?.workspace?.bucket.objects.items) {
      setItems(data.workspace.bucket.objects.items);
    }
  }, [data]);

  return (
    <Popover
      withPortal
      placement="bottom-start"
      buttonClassName="w-full"
      className="w-96 gap-4 grid px-0 max-h-96"
      trigger={
        <Input
          fullWidth
          placeholder={value ?? placeholder}
          readOnly
          trailingIcon={
            <button className="text-gray-400 hover:text-gray-600">
              {value ? (
                <XMarkIcon className="h4 w-4" />
              ) : (
                <ChevronUpDownIcon className="h-4 w-4" />
              )}
            </button>
          }
        />
      }
    >
      <div className="flex items-center text-sm px-4">
        <button className="mr-2">
          <ChevronLeftIcon className="h-4 w-4 " />
        </button>
        <div>current directory</div>
      </div>
      <ul className="text-sm text-gray-600">
        {items.map((item) => (
          <li key={item.key}>
            <button className="w-full flex items-center justify-between py-4 hover:bg-gray-100 px-4">
              {item.name}
              {item.type === BucketObjectType.Directory ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  );
};

BucketObjectPicker.fragments = {
  workspace: gql`
    fragment BucketObjectPicker_workspace on Workspace {
      slug
    }
  `,
};

export default BucketObjectPicker;
