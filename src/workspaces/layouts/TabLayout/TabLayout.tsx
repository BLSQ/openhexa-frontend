import { gql } from "@apollo/client";
import DataCard from "core/components/DataCard";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import LinkTabs from "core/components/Tabs/LinkTabs/LinkTabs";

const TabLayoutHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => <div className={className}>{children}</div>;

const TabLayoutPageContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

type TabLayoutProps = {
  workspace: any;
  item: any;
  currentTab: string;
  children: React.ReactNode;
  helpLinks?: { label: string; href: string }[];
  tabs: { label: string; href: string; id: string }[];
};

const TabLayout = ({
  workspace,
  item,
  currentTab,
  children,
  helpLinks,
  tabs,
}: TabLayoutProps) => {
  const { t } = useTranslation();

  // Separate out the children to find if TabLayout.Header is included
  const headerChild = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TabLayout.Header,
  );

  const contentChild = React.Children.toArray(children).find(
    (child) =>
      React.isValidElement(child) && child.type === TabLayout.PageContent,
  );

  return (
    <WorkspaceLayout workspace={workspace} helpLinks={helpLinks}>
      <WorkspaceLayout.Header>{headerChild}</WorkspaceLayout.Header>
      <WorkspaceLayout.PageContent>
        <DataCard item={item}>
          <LinkTabs className="mx-4 mt-2" tabs={tabs} selected={currentTab} />
          {contentChild}
        </DataCard>
      </WorkspaceLayout.PageContent>
    </WorkspaceLayout>
  );
};

TabLayout.fragments = {
  workspace: gql`
    fragment BaseLayout_workspace on Workspace {
      ...WorkspaceLayout_workspace
      name
    }
    ${WorkspaceLayout.fragments.workspace}
  `,
};

TabLayout.Header = TabLayoutHeader;
TabLayout.PageContent = TabLayoutPageContent;

export default TabLayout;
