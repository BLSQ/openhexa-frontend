import { gql } from "@apollo/client";
import clsx from "clsx";
import { CustomApolloClient } from "core/helpers/apollo";
import { createContext, ReactElement, useState } from "react";
import Header from "./Header";
import PageContent from "./PageContent";
import Sidebar from "./Sidebar";
import { WorkspaceLayout_WorkspaceFragment } from "./WorkspaceLayout.generated";

type WorkspaceLayoutProps = {
  children: ReactElement | ReactElement[];
  className?: string;
  workspace: WorkspaceLayout_WorkspaceFragment;
};

export const LayoutContext = createContext({
  isOpen: false,
  setOpen: (isOpen: boolean) => {},
});

const WorkspaceLayout = (props: WorkspaceLayoutProps) => {
  const { children, className, workspace } = props;
  const [isOpen, setOpen] = useState(false);
  return (
    <LayoutContext.Provider value={{ isOpen, setOpen }}>
      <div
        className={clsx(
          "fixed inset-y-0 flex w-64 -translate-x-full flex-col transition-all",
          isOpen ? "translate-x-0" : ""
        )}
      >
        <Sidebar workspace={workspace} />
      </div>

      <main
        className={clsx(
          "flex flex-col transition-all",
          className,
          isOpen ? "pl-64" : "pl-0"
        )}
      >
        {children}
      </main>
    </LayoutContext.Provider>
  );
};

WorkspaceLayout.fragments = {
  workspace: gql`
    fragment WorkspaceLayout_workspace on Workspace {
      slug
      ...Sidebar_workspace
    }
    ${Sidebar.fragments.workspace}
  `,
};

WorkspaceLayout.prefetch = async (client: CustomApolloClient) => {
  await Sidebar.prefetch(client);
};

WorkspaceLayout.PageContent = PageContent;
WorkspaceLayout.Header = Header;

export default WorkspaceLayout;
