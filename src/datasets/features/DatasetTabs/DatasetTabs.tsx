import React, { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import Tabs from "core/components/Tabs";
import { useTranslation } from "next-i18next";
import { DatasetVersion } from "graphql/types";

type DatasetTabsProps = {
  currentTab?: string;
  datasetSlug: string;
  version?: Pick<DatasetVersion, "id"> | null;
  workspaceSlug: string;
  isWorkspaceSource?: boolean;
  children: ReactElement;
};

const TABS = ["", "files", "management"];

const DatasetTabs = (props: DatasetTabsProps) => {
  const {
    currentTab,
    datasetSlug,
    version,
    workspaceSlug,
    isWorkspaceSource = false,
    children,
  } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const onTabChange = (index: number) => {
    const selectedTab = TABS[index];
    const query = version ? { version: version?.id } : {};
    router.push({
      pathname: `/workspaces/${workspaceSlug}/datasets/${datasetSlug}/${selectedTab}`,
      query: query,
    });
  };
  const tabIndex: number = useMemo(() => {
    return currentTab && TABS.indexOf(currentTab)
      ? TABS.indexOf(currentTab)
      : 0;
  }, []);

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

export default DatasetTabs;
