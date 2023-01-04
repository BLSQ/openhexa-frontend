import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Quicksearch from "catalog/features/Quicksearch";
import clsx from "clsx";
import Avatar from "core/components/Avatar";
import useToggle from "core/hooks/useToggle";
import { logout } from "identity/helpers/auth";
import useMe from "identity/hooks/useMe";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import Menu from "core/components/Menu";
import Navbar from "./Navbar";
import { LayoutClasses } from "./styles";
import { WORKSPACES } from "workspaces/helpers/fixtures";
import useFeature from "identity/hooks/useFeature";
import { useQuery } from "@apollo/client";
import {
  WorkspacesPageDocument,
  WorkspacesPageQuery,
  WorkspacesPageQueryVariables,
} from "workspaces/graphql/queries.generated";

const Header = () => {
  const me = useMe();
  const router = useRouter();
  const { t } = useTranslation();
  const [isSearchOpen, { toggle: toggleSearch }] = useToggle(false);
  useHotkeys("cmd+k,ctrl+k", toggleSearch);

  const [hasWorkspacesEnabled] = useFeature("workspaces");

  const { data } = useQuery<WorkspacesPageQuery, WorkspacesPageQueryVariables>(
    WorkspacesPageDocument,
    {
      variables: { page: 1, perPage: 1 },
      skip: !hasWorkspacesEnabled,
    }
  );

  if (!me.user) {
    return null;
  }
  return (
    <div className="bg-gray-800">
      <div
        className={clsx(
          LayoutClasses.container,
          "flex h-16 items-center gap-6"
        )}
      >
        <Link
          href="/dashboard"
          className="relative flex h-8 flex-shrink-0 items-center"
        >
          <img
            className="block h-full lg:hidden"
            src="/images/logo.svg"
            alt="OpenHexa logo"
          />
          <img
            className="hidden h-full lg:block"
            src="/images/logo_with_text_white.svg"
            alt="OpenHexa logo"
          />
        </Link>
        <Navbar />
        <button
          onClick={toggleSearch}
          className="group mr-4 hidden flex-shrink cursor-pointer items-center space-x-2 text-gray-400 hover:text-white md:inline-flex"
        >
          <MagnifyingGlassIcon className="h-5" />
          <span>{t("Search")}</span>
          <span className="inline-flex items-center rounded border border-gray-400 p-1 text-xs font-medium shadow-sm focus:outline-none group-hover:border-white">
            ⌘K
          </span>
        </button>
        <Quicksearch open={isSearchOpen} onClose={toggleSearch} />

        <Menu
          trigger={
            <Avatar
              initials={me.user?.avatar.initials ?? ""}
              color={me.user ? me.user.avatar.color : undefined}
              size="md"
            />
          }
        >
          <Menu.Item href="/user/account">{t("Your account")}</Menu.Item>
          {me.permissions.adminPanel && (
            <Menu.Item href="/admin">{t("Administration")}</Menu.Item>
          )}
          {hasWorkspacesEnabled && data?.workspaces.totalItems ? (
            <Menu.Item
              href={{
                pathname: `/workspaces/[workspaceId]`,
                query: {
                  workspaceId: data.workspaces.items[0].id,
                },
              }}
            >
              {t("Your workspaces")}
            </Menu.Item>
          ) : (
            <></>
          )}

          <Menu.Item onClick={() => logout()}>{t("Sign out")}</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
