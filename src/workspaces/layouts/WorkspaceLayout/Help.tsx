import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "core/components/Link";
import Popover from "core/components/Popover/Popover";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

type HelpProps = Pick<React.ComponentProps<typeof Popover>, "placement"> & {
  links?: { label: string; href: string }[];
  className?: string;
  children?: ReactElement;
};

const Help = (props: HelpProps) => {
  const { placement, links, className } = props;
  const { t } = useTranslation();

  const children = props.children ?? (
    <QuestionMarkCircleIcon className="m-1.5 h-9 w-9 rounded-full p-1 hover:bg-gray-100" />
  );

  if (links) {
    return (
      <Popover
        buttonClassName={clsx("outline-none", className)}
        trigger={children}
        className="w-96"
        placement={placement}
      >
        <p>
          {t(
            "Based on the page you are on, we have selected some help topics that might be relevant to you."
          )}
        </p>
        <ul className="list-inside list-disc py-2">
          {links.map((link) => (
            <li key={link.href} className="py-1">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="-mx-4 -mb-4 border-t border-gray-300 bg-gray-100 px-4 py-4">
          <Link
            href="https://github.com/BLSQ/openhexa/wiki"
            customStyle="text-gray-900 hover:text-gray-500"
            target="_blank"
          >
            {t("Or visit the OpenHexa wiki for more help")}
          </Link>
        </div>
      </Popover>
    );
  } else {
    return (
      <Link
        href="https://github.com/BLSQ/openhexa/wiki"
        noStyle
        target="_blank"
      >
        {children}
      </Link>
    );
  }
};

export default Help;
