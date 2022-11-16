import { useRouter } from "next/router";
import type { ReactElement } from "react";
import Header from "./Header";
import PageContent from "./PageContent";
import Sidebar from "./Sidebar";

type WorkspaceLayoutProps = {
  children: ReactElement;
  pageProps: any;
};

const WorkspaceLayout = (props: WorkspaceLayoutProps) => {
  const { children } = props;
  const router = useRouter();

  const workspaceId = router.query.workspaceId as string;

  if (!workspaceId) {
    return null;
  }

  return (
    <>
      <Sidebar workspaceId={workspaceId} />
      <main className="flex  flex-col pl-64">{children}</main>
    </>
  );
};

WorkspaceLayout.PageContent = PageContent;
WorkspaceLayout.Header = Header;

export default WorkspaceLayout;
