import { useQuery } from "@apollo/client";
import { Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "core/components/Link";
import User from "core/features/User";
import useCacheKey from "core/hooks/useCacheKey";
import useToggle from "core/hooks/useToggle";
import { Country, Workspace } from "graphql-types";
import useFeature from "identity/hooks/useFeature";
import useMe from "identity/hooks/useMe";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import useOnClickOutside from "use-onclickoutside";
import {
  WorkspacesPageDocument,
  WorkspacesPageQuery,
  WorkspacesPageQueryVariables,
} from "workspaces/graphql/queries.generated";

import CreateWorkspaceDialog from "../CreateWorkspaceDialog";

interface SidebarMenuProps {
  workspace: Pick<Workspace, "name"> & {
    countries?: Array<Pick<Country, "code" | "flag">> | null;
  };
}
const POPPER_MODIFIERS = [{ name: "offset", options: { offset: [8, 4] } }];

const SidebarMenu = (props: SidebarMenuProps) => {
  const { workspace } = props;
  const { t } = useTranslation();
  const me = useMe();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const isAdmin = useFeature("adminPanel");

  const [isOpen, { toggle, setFalse }] = useToggle();
  const router = useRouter();

  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: "fixed",
    placement: "bottom-start",
    modifiers: POPPER_MODIFIERS,
  });
  const innerMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(innerMenuRef, () => {
    if (!isDialogOpen) {
      // Do not close the menu if the user click in the dialog
      setFalse();
    }
  });

  useEffect(() => {
    if (isOpen) {
      setFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  const { data, loading, refetch } = useQuery<
    WorkspacesPageQuery,
    WorkspacesPageQueryVariables
  >(WorkspacesPageDocument, {
    variables: { page: 1, perPage: 5 },
    fetchPolicy: "no-cache",
  });

  useCacheKey("workspaces", () => {
    refetch();
  });

  const showMore = (perPage: number) => {
    refetch({
      page: 1,
      perPage,
    });
  };

  if (!workspace) {
    return null;
  }

  return (
    <div className="w-full" ref={innerMenuRef}>
      <button
        className="group flex h-16 w-full items-center bg-gray-800 px-2 text-left hover:bg-gray-600"
        ref={setReferenceElement}
        onClick={toggle}
      >
        {workspace.countries && workspace.countries.length === 1 && (
          <div className="mr-2.5 flex h-full items-center">
            <img
              alt="Country flag"
              loading="lazy"
              className="w-5 rounded-sm"
              src={workspace.countries[0].flag}
            />
          </div>
        )}
        <div
          className={clsx(
            "flex-1 text-sm tracking-tight text-gray-50 line-clamp-2"
          )}
          title={workspace.name}
        >
          {workspace.name}
          {me.user && (
            <div className="text-xs tracking-tighter text-gray-500 group-hover:text-gray-400">
              {me.user.email}
            </div>
          )}
          {/* This will be pushed outside of the block if there is not enough space to display it */}
        </div>
        <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500 group-hover:text-gray-100" />
      </button>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        afterLeave={() => showMore(5)}
      >
        <div
          style={styles.popper}
          ref={setPopperElement}
          {...attributes.popper}
          className="divide flex w-72 flex-col divide-y divide-gray-200 overflow-hidden rounded bg-white pt-2 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <section>
            <div className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium tracking-wide text-gray-500 opacity-90">
              {t("Your workspaces")}

              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                title={t("Create a new workspace")}
                className="text-gray-400 hover:text-gray-600"
              >
                <PlusCircleIcon className="h-5 w-5 " />
              </button>
              <CreateWorkspaceDialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {data &&
                data?.workspaces.items.map((workspace, index) => (
                  <Link
                    noStyle
                    href={{
                      pathname: "/workspaces/[workspaceId]",
                      query: { workspaceId: workspace.id },
                    }}
                    className="flex items-center py-2.5 px-4 hover:bg-gray-100"
                    key={index}
                  >
                    {workspace.countries &&
                      workspace.countries.length === 1 && (
                        <div className="mr-2.5 flex h-full items-center">
                          <img
                            alt="Country flag"
                            className="h-4 flex-shrink rounded-sm"
                            src={workspace.countries[0].flag}
                          />
                        </div>
                      )}
                    <span className="text-sm leading-tight tracking-tight">
                      {workspace.name}
                    </span>
                  </Link>
                ))}
              {data &&
                data?.workspaces.totalItems !==
                  data.workspaces.items.length && (
                  <div className="pb-2 text-center">
                    <button
                      onClick={() => showMore(data.workspaces.totalItems)}
                      className="ml-4 inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400"
                    >
                      {t("Show more")}
                    </button>
                  </div>
                )}
            </div>

            {false && (
              <div className="text-center">
                <button
                  type="button"
                  className="pb-2  text-xs font-normal  text-gray-500"
                >
                  {t("See all")}
                </button>
              </div>
            )}
          </section>

          <section className="flex flex-col text-sm font-normal">
            <Link
              href="/user/account"
              noStyle
              className="group flex gap-2 px-4 py-2.5 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-800"
            >
              <UserIcon className="h-5 w-5 text-gray-400 transition-all group-hover:text-gray-600" />
              {t("Account settings")}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                noStyle
                className="group flex gap-2 px-4 py-2.5 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-800"
              >
                <Cog6ToothIcon className="h-5 w-5 text-gray-400 transition-all group-hover:text-gray-600" />
                {t("Administration")}
              </Link>
            )}
            <Link
              href="/dashboard"
              noStyle
              className="group flex gap-2 px-4 py-2.5 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-800"
            >
              <XCircleIcon className="h-5 w-5 text-gray-400 transition-all group-hover:text-gray-600" />
              {t("Exit preview")}
            </Link>
            <Link
              href="/auth/logout"
              noStyle
              className="group flex gap-2 px-4 py-2.5 text-red-600 transition-all hover:bg-gray-100 hover:text-gray-800"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {t("Sign out")}
            </Link>
          </section>

          {me.user && (
            <section className="bg-gray-100 px-3 py-3">
              <User textColor="text-gray-600" user={me.user} subtext />
            </section>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default SidebarMenu;
