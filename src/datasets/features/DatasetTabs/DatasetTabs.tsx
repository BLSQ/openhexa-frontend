import React, { ReactElement, Fragment, useCallback } from "react";
import { useRouter } from "next/router";
import { Tab as HeadlessTab } from "@headlessui/react";
import clsx from "clsx";

export type DatasetTabType = { label: string; href: string };

type DatasetTabsProps = {
  children: ReactElement | ReactElement[];
  tabs: DatasetTabType[];
};

const DatasetTabs = (props: DatasetTabsProps) => {
  const router = useRouter();
  const { children, tabs = [] } = props;

  const isActiveTab = useCallback(
    (tab: DatasetTabType) => tab.href === router.asPath,
    [],
  );

  return (
    <HeadlessTab.Group>
      <HeadlessTab.List className="space-x-4">
        {tabs.map((tab, id) => (
          <HeadlessTab key={id} as={Fragment}>
            <a
              href={tab.href || ""}
              className={clsx(
                "cursor-pointer whitespace-nowrap border-b-2 px-1.5 py-2.5 tracking-wide",
                isActiveTab(tab)
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              )}
            >
              {tab.label}
            </a>
          </HeadlessTab>
        ))}
      </HeadlessTab.List>
      <HeadlessTab.Panels>
        <HeadlessTab.Panel className="px-2 py-4">{children}</HeadlessTab.Panel>
      </HeadlessTab.Panels>
    </HeadlessTab.Group>
  );
};

export default DatasetTabs;
