import Avatar from "core/components/Avatar";
import Menu from "core/components/Menu";
import { logout } from "identity/helpers/auth";
import useMe from "identity/hooks/useMe";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { WORKSPACES } from "workspace/helpers/fixtures";

type HeaderProps = {
  children?: ReactNode;
};

const Header = (props: HeaderProps) => {
  const me = useMe();
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow md:px-6">
      <div className="flex-1">{props.children}</div>
      <Menu
        trigger={
          <Avatar
            initials={me.user?.avatar.initials ?? ""}
            color={me.user ? me.user.avatar.color : undefined}
            size="sm"
          />
        }
      >
        <Menu.Item onClick={() => router.push("/user/account")}>
          {t("Your account")}
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            router.push({
              pathname: "/workspaces/[workspaceId]",
              query: { workspaceId: WORKSPACES[0].id },
            })
          }
        >
          {t("Your workspaces")}
        </Menu.Item>
        {me.permissions.adminPanel && (
          <Menu.Item onClick={() => router.push("/admin")}>
            {t("Admin")}
          </Menu.Item>
        )}

        <Menu.Item onClick={() => logout()}>{t("Sign out")}</Menu.Item>
      </Menu>
    </div>
  );
};

export default Header;
