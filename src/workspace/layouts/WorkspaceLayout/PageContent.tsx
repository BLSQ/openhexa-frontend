import clsx from "clsx";
import { HTMLAttributes } from "react";

export default function PageContent(props: HTMLAttributes<HTMLDivElement>) {
  const { children, className } = props;
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">{children}</div>
    </div>
  );
}
