import { Bars3Icon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Button from "core/components/Button";
import { ReactNode, useContext } from "react";
import { LayoutContext } from "./WorkspaceLayout";

type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

const Header = (props: HeaderProps) => {
  const { className, children } = props;
  const { isOpen, setOpen } = useContext(LayoutContext);
  return (
    <div
      className={clsx(
        "sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white py-3 shadow",
        "group relative px-4 md:px-6 xl:px-10 2xl:px-12"
      )}
    >
      <div
        className={clsx(
          "absolute left-2.5 flex cursor-pointer items-center transition-all",
          isOpen && "opacity-0 duration-100 group-hover:opacity-100"
        )}
      >
        <button
          className="inline-flex h-fit items-center justify-center rounded focus:outline-none focus:ring-0"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronLeftIcon className="w-5" />
          ) : (
            <Bars3Icon className="w-5" />
          )}
        </button>
      </div>
      <div className={clsx("ml-6 flex-1", className)}>{children}</div>
    </div>
  );
};

export default Header;
