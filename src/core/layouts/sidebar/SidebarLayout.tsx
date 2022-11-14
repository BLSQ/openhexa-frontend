import type { ReactElement } from "react";
import Sidebar from "./Sidebar";

type SidebarLayoutProps = {
  children: ReactElement;
  pageProps: any;
};

const SidebarLayout = (props: SidebarLayoutProps) => {
  const { children } = props;
  return (
    <div className="flex flex-1 flex-col md:pl-64">
      <Sidebar />
      {children}
    </div>
  );
};

export default SidebarLayout;
