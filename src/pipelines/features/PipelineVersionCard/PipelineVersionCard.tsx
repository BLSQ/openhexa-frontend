import { gql } from "@apollo/client";
import Badge from "core/components/Badge";
import Block from "core/components/Block";
import DescriptionList from "core/components/DescriptionList";
import Time from "core/components/Time";
import Title from "core/components/Title";
import { useTranslation } from "next-i18next";
import PipelineVersionParametersTable from "../PipelineVersionParametersTable";
import { PipelineVersionCard_VersionFragment } from "./PipelineVersionCard.generated";

type PipelineVersionCardProps = {
  version: PipelineVersionCard_VersionFragment;
};

const PipelineVersionCard = ({ version }: PipelineVersionCardProps) => {
  const { t } = useTranslation();
  return (
    <Block key={version.id} className="mb-4">
      <Block.Content>
        <Title level={1}>{version.number}</Title>
        <DescriptionList>
          <DescriptionList.Item label={t("Identifier")}>
            <code>{version.number}</code>
            {version.id === pipeline.currentVersion?.id && (
              <Badge
                className="ml-2 text-gray-500 text-sm"
                borderColor="border-gray-300"
              >
                {t("Latest version")}
              </Badge>
            )}
          </DescriptionList.Item>
          <DescriptionList.Item label={t("Created at")}>
            <Time datetime={version.createdAt} />
          </DescriptionList.Item>
          <DescriptionList.Item label={t("Created by")}>
            {version.user?.displayName ?? "-"}
          </DescriptionList.Item>
          <DescriptionList.Item label={t("Parameters")}>
            {version.parameters.length === 0 ? (
              <span className="">-</span>
            ) : (
              <div className="rounded-md overflow-hidden border border-gray-100">
                <PipelineVersionParametersTable version={version} />
              </div>
            )}
          </DescriptionList.Item>
        </DescriptionList>
      </Block.Content>
    </Block>
  );
};

PipelineVersionCard.fragments = {
  version: gql`
    fragment PipelineVersionCard_version on PipelineVersion {
      id
      number
      parameters {
        code
        name
        type
        multiple
        required
        help
      }
      pipeline {
        id
        code
      }
    }
  `,
};

export default PipelineVersionCard;
