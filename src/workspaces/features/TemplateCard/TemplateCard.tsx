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
import React from "react";
import Button from "core/components/Button";
import router from "next/router";

interface TemplateCardProps {
  workspace: TemplateCard_WorkspaceFragment;
  template: TemplateCard_TemplateFragment;
  onCreate?: () => void;
}

const TemplateCard = ({ template, workspace, onCreate }: TemplateCardProps) => {
  const { t } = useTranslation();
  return (
    <div className={"relative group"}>
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
        className={"group-hover:blur-xs"}
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
      <div
        className={
          "hidden group-hover:flex flex-col gap-2 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        }
      >
        <Button variant="secondary" size="md" onClick={onCreate}>
          {t("Create pipeline")}
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() =>
            router.push(
              `/workspaces/${workspace.slug}/templates/${template.code}`,
            )
          }
        >
          {t("Details")}
        </Button>
      </div>
    </div>
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
