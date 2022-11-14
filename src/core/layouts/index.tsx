import getConfig from "next/config";
import { ReactElement, ReactNode } from "react";
import DefaultLayout, { PageContent as DefaultPageContent } from "./default";
import SidebarLayout, { PageContent as SidebarPageContent } from "./sidebar";

const { publicRuntimeConfig } = getConfig();

function CurrentLayout(props: { pageProps: any; children: ReactElement }) {
  if (publicRuntimeConfig.layout === "sidebar") {
    return <SidebarLayout {...props} />;
  } else {
    return <DefaultLayout {...props} />;
  }
}

CurrentLayout.PageContent = (props: { children: ReactNode }) => {
  if (publicRuntimeConfig.layout === "sidebar") {
    return <SidebarPageContent {...props} />;
  } else {
    return <DefaultPageContent {...props} />;
  }
};

export default CurrentLayout;
