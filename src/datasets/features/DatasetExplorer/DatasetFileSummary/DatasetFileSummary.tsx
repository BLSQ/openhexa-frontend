import { gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { DatasetFileSummary_FileFragment } from "./DatasetFileSummary.generated";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import DescriptionList, {
  DescriptionListDisplayMode,
} from "core/components/DescriptionList";
import Block from "core/components/Block";

type DatasetFileSummaryProps = {
  file: DatasetFileSummary_FileFragment;
};

const DatasetFileSummary = (props: DatasetFileSummaryProps) => {
  const { file } = props;
  const { t } = useTranslation();

  return (
    <Block>
      <Block.Content className="space-y-4 min-screen">
        <p className="flex items-center gap-3">
          <DocumentIcon className="h-6 w-6" />
          <span className="font-bold text-xl text-gray-700">
            {file?.filename}
          </span>
        </p>
        <DescriptionList
          columns={3}
          displayMode={DescriptionListDisplayMode.LABEL_ABOVE}
        >
          <DescriptionList.Item label={t("Type")} className="font-semibold">
            {file?.contentType}
          </DescriptionList.Item>
          <DescriptionList.Item
            label={t("Created at")}
            className="font-semibold"
          >
            {file?.createdAt &&
              DateTime.fromISO(file?.createdAt).toLocaleString(
                DateTime.DATE_FULL,
              )}
          </DescriptionList.Item>
        </DescriptionList>
      </Block.Content>
    </Block>
  );
};

DatasetFileSummary.fragments = {
  file: gql`
    fragment DatasetFileSummary_file on DatasetVersionFile {
      id
      filename
      contentType
      createdAt
    }
  `,
};

export default DatasetFileSummary;
