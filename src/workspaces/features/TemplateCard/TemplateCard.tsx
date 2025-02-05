import { gql } from "@apollo/client";
import clsx from "clsx";
import Card from "core/components/Card";
import { useTranslation } from "next-i18next";
import {
  TemplateCard_TemplateFragment,
  TemplateCard_WorkspaceFragment,
} from "./TemplateCard.generated";
import Tooltip from "core/components/Tooltip";
import { DateTime } from "luxon";
import UserAvatar from "identity/features/UserAvatar";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "core/components/Button";
import React from "react";

interface TemplateCardProps {
  workspace: TemplateCard_WorkspaceFragment;
  template: TemplateCard_TemplateFragment;
  onCreate?: () => void;
}

const TemplateCard = ({ template, workspace, onCreate }: TemplateCardProps) => {
  const { t } = useTranslation();
  return (
    <Card
      href={{
        pathname: `/workspaces/[workspaceSlug]/templates/[templateCode]`,
        query: { workspaceSlug: workspace.slug, templateCode: template.code },
      }}
      title={
        <div className="flex justify-between">
          <span className="max-w-[80%]">{template.name}</span>
        </div>
      }
    >
      <Card.Content
        className="space-y-4 min-h-20 min-w-30"
        title={template.description ?? ""}
      >
        <div
          className={clsx("line-clamp-3", !template.description && "italic")}
        >
          {template.description || t("No description")}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreate}
          leadingIcon={<PlusIcon className="h-4 w-4" />}
        >
          {t("Create pipeline")}
        </Button>
        {template.currentVersion?.user && (
          <div className="flex justify-end">
            <Tooltip
              label={t("Last version uploaded on {{date}} by {{name}}", {
                date: DateTime.fromISO(
                  template.currentVersion.createdAt,
                ).toLocaleString(DateTime.DATE_FULL),
                name: template.currentVersion.user.displayName,
              })}
            >
              <UserAvatar user={template.currentVersion.user} size="sm" />
            </Tooltip>
          </div>
        )}
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
        id
        createdAt
        user {
          ...User_user
        }
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
