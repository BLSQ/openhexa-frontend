import clsx from "clsx";
import { HTMLAttributes } from "react";

export default function PageContent(props: HTMLAttributes<HTMLDivElement>) {
  const { children, className, ...delegated } = props;
  return (
    <main className={clsx("pb-6", className)} {...delegated}>
      {children}
    </main>
  );
}
