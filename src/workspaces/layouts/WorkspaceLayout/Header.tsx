import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Tooltip from "core/components/Tooltip/Tooltip";
import { ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
  className?: string;
  helpLink?: string;
};

const Header = (props: HeaderProps) => {
  const { className, children, helpLink } = props;
  return (
    <div
      className={clsx(
        "sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white py-3 shadow",
        "group relative px-4 md:px-6 xl:px-10 2xl:px-12"
      )}
    >
      <div
        className={clsx(
          "flex-1",
          className,
          helpLink && "space-between flex items-center justify-between"
        )}
      >
        {children}
        {helpLink && (
          <Tooltip label={"Open the wiki"}>
            <a
              href={helpLink}
              target="_blank"
              className="block rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <QuestionMarkCircleIcon className="h-7 w-7" />
            </a>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Header;
