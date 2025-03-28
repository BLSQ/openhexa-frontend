import { gql } from "@apollo/client";
import Card from "core/components/Card";
import { WebappCard_WebappFragment } from "./WebappCard.generated";
import React from "react";
import Link from "core/components/Link";
import { PlayCircleIcon } from "@heroicons/react/24/outline";

type WebappCardProps = {
  webapp: WebappCard_WebappFragment;
};

const WebappCard = ({ webapp }: WebappCardProps) => {
  const { workspace, id, name, icon } = webapp;
  return (
    <Card
      href={{
        pathname: "/workspaces/[workspaceSlug]/webapps/[webappId]/play",
        query: { workspaceSlug: workspace.slug, webappId: id },
      }}
      title={
        <div className={"flex items-center"}>
          {icon && (
            <img src={icon} className="h-8 w-8 rounded mr-3" alt={"Icon"} />
          )}
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
      }
    >
      <Link
        href={{
          pathname: `/workspaces/${encodeURIComponent(workspace.slug)}/webapps/${id}/play`,
        }}
        className={"flex items-center justify-end"}
      >
        <PlayCircleIcon className="h-10 w-10 text-blue-500 hover:scale-125" />
      </Link>
    </Card>
  );
};

// TODO : why grey

WebappCard.fragments = {
  webapp: gql`
    fragment WebappCard_webapp on Webapp {
      id
      icon
      name
      workspace {
        slug
        name
      }
    }
  `,
};

export default WebappCard;
