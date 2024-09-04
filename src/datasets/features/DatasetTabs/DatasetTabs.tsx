import React, { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import Tabs from "core/components/Tabs";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import { DatasetTabs_DatasetlinkFragment } from "./DatasetTabs.generated";

type DatasetTabsProps = {
  currentTab?: string;
  datasetLink: DatasetTabs_DatasetlinkFragment;
  children: ReactElement;
};

const TABS = ["", "files", "management"];

const DatasetTabs = (props: DatasetTabsProps) => {
  const { currentTab, datasetLink, children } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const { dataset, workspace } = datasetLink;

  const onTabChange = (index: number) => {
    const selectedTab = TABS[index];
    if (selectedTab !== "files") {
      delete router.query["fileId"];
    }

    router.push({
      pathname: `/workspaces/[workspaceSlug]/datasets/[datasetSlug]/${selectedTab}`,
      query: { ...router.query },
    });
  };
  const tabIndex: number = useMemo(() => {
    return currentTab && TABS.indexOf(currentTab)
      ? TABS.indexOf(currentTab)
      : 0;
  }, []);

  const isWorkspaceSource = workspace.slug === dataset.workspace?.slug;

  return (
    <Tabs defaultIndex={tabIndex} onChange={onTabChange}>
      <Tabs.Tab label={t("Description")}>
        {tabIndex === 0 ? children : <></>}
      </Tabs.Tab>
      <Tabs.Tab label={t("Data files")}>
        {tabIndex === 1 ? children : <></>}
      </Tabs.Tab>
      {isWorkspaceSource && (
        <Tabs.Tab label={t("Access Management")}>
          {tabIndex === 2 ? children : <></>}
        </Tabs.Tab>
      )}
    </Tabs>
  );
};

DatasetTabs.fragments = {
  datasetLink: gql`
    fragment DatasetTabs_datasetlink on DatasetLink {
      id
      dataset {
        slug
        workspace {
          slug
        }
      }
      workspace {
        slug
      }
    }
  `,
};
export default DatasetTabs;
