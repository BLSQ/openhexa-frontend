import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Alert from "core/components/Alert";
import { Transition } from "@headlessui/react";
import Button from "core/components/Button";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LaunchNotebookServerDocument } from "workspaces/graphql/mutations.generated";
import {
  useWorkspaceNotebooksPageQuery,
  WorkspaceNotebooksPageDocument,
} from "workspaces/graphql/queries.generated";
import WorkspaceLayout from "workspaces/layouts/WorkspaceLayout";
import clsx from "clsx";
import SearchInput from "catalog/features/SearchInput";
import Title from "core/components/Title";

type Props = {
  notebooksUrl: string;
};

const WorkspaceNotebooksPage: NextPageWithLayout = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const workspaceSlug = router.query.workspaceSlug as string;
  const { data } = useWorkspaceNotebooksPageQuery({
    variables: { workspaceSlug },
  });
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      console.log(e);
    });
  }, []);

  if (!data?.workspace) {
    return null;
  }

  return (
    <Page title={t("Workspace")}>
      <WorkspaceLayout
        workspace={data.workspace}
        className="relative min-h-screen"
      >
        <iframe
          className="h-full w-full flex-1"
          src={"https://tailwindcss.com"}
        ></iframe>
        <div
          className={clsx(
            "fixed top-32 right-0 z-20 h-96 transform transition-all duration-500",
            isOpen ? "" : "translate-x-full"
          )}
        >
          <div className="absolute top-4 right-full mr-3">
            <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
              {!isOpen ? (
                <QuestionMarkCircleIcon className="h-5" />
              ) : (
                <ChevronRightIcon className="h-5" />
              )}
            </Button>
          </div>
          <div className="flex h-full w-96 flex-col rounded-md border border-gray-100 bg-white p-3 shadow-lg">
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder={"Search snippet"}
            />
            <div className="mt-4 flex-1 space-y-4 overflow-y-scroll">
              <div>
                <Title level={6}>Insert python code</Title>
                <pre className="rounded-md bg-slate-400 p-2 font-mono text-gray-50">
                  import os
                </pre>
              </div>
              <div>
                <Title level={6}>Insert python code</Title>
                <pre className="rounded-md bg-slate-400 p-2 font-mono text-gray-50">
                  import os
                </pre>
              </div>
              <div>
                <Title level={6}>Create database</Title>
                <pre className="rounded-md bg-slate-400 p-2 font-mono text-gray-50">
                  import os
                </pre>
              </div>
              <div>
                <Title level={6}>Insert into database</Title>
                <pre className="rounded-md bg-slate-400 p-2 font-mono text-gray-50">
                  import os
                </pre>
              </div>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    </Page>
  );
};

WorkspaceNotebooksPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    await WorkspaceLayout.prefetch(client);
    const { data } = await client.query({
      query: WorkspaceNotebooksPageDocument,
      variables: { workspaceSlug: ctx.params?.workspaceSlug },
    });

    if (!data.workspace || !data.workspace.permissions.update) {
      return {
        notFound: true,
      };
    }
  },
});

export default WorkspaceNotebooksPage;
