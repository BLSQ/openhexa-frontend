import { gql } from "@apollo/client";
import Card from "core/components/Card";
import { WebappCard_WebappFragment } from "./WebappCard.generated";

type WebappCardProps = {
  webapp: WebappCard_WebappFragment;
};

const WebappCard = ({ webapp }: WebappCardProps) => {
  const { workspace, id, name, description } = webapp;
  return (
    <Card
      href={{
        pathname: "/workspaces/[workspaceSlug]/webapps/[webappId]",
        query: { workspaceSlug: workspace.slug, webappId: id },
      }}
      title={name}
      subtitle={description}
    >
      Hello
    </Card>
  );
};

WebappCard.fragments = {
  webapp: gql`
    fragment WebappCard_webapp on Webapp {
      id
      name
      description
      workspace {
        slug
        name
      }
    }
  `,
};

export default WebappCard;
