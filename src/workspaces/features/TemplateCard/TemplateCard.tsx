import { gql } from "@apollo/client";
import clsx from "clsx";
import Card from "core/components/Card";
import { useTranslation } from "next-i18next";
import {
  TemplateCard_TemplateFragment,
  TemplateCard_WorkspaceFragment,
} from "./TemplateCard.generated";

interface TemplateCardProps {
  workspace: TemplateCard_WorkspaceFragment;
  template: TemplateCard_TemplateFragment;
}

const TemplateCard = ({ template, workspace }: TemplateCardProps) => {
  const { t } = useTranslation();
  return (
    <Card
      href={{
        pathname: `/workspaces/[workspaceSlug]/templates/[templateCode]`,
        query: { workspaceSlug: workspace.slug, templateCode: template.code },
      }}
      title={template.name}
    >
      <Card.Content className="space-y-4" title={template.description ?? ""}>
        <div
          className={clsx("line-clamp-3", !template.description && "italic")}
        >
          {template.description || t("No description")}
        </div>
      </Card.Content>
    </Card>
  );
};

TemplateCard.fragments = {
  template: gql`
    fragment TemplateCard_template on PipelineTemplate {
      id
      code
      name
      description
      currentVersion {
        createdAt
      }
    }
  `,
  workspace: gql`
    fragment TemplateCard_workspace on Workspace {
      slug
    }
  `,
};

export default TemplateCard;
