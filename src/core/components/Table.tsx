import clsx from "clsx";
import { HTMLAttributes } from "react";

export const TableClasses = {
  table: "w-full divide-y divide-gray-200 ",
  thead: "bg-gray-50",
  tbody: "divide-y divide-gray-200",
  tr: "",
  th: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex",
  thCondensed:
    "px-3 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider",
  td: "px-6 py-5 text-sm text-gray-500 flex items-center w-full",
  tdCondensed: "px-3 py-2.5 text-left text-sm text-gray-500 whitespace-nowrap",
};

export const Table = (props: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto">
    <table {...props} className={clsx(props.className, TableClasses.table)} />
  </div>
);

export const TableHead = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={props.className ?? TableClasses.thead} {...props} />
);

export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={props.className ?? TableClasses.tbody} {...props} />
);

export const TableRow = (props: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={props.className ?? TableClasses.tr} {...props} />
);

export const TableCell = (
  props: HTMLAttributes<HTMLTableCellElement> & {
    width?: string;
    heading?: boolean;
    wrap?: boolean;
    overrideStyle?: boolean;
  }
) => {
  const {
    heading = false,
    wrap = false,
    overrideStyle = false,
    className,
    children,
    width,
    ...delegated
  } = props;
  const Elm = heading ? "th" : "td";
  const extraProps: { [key: string]: any } = {};

  if (heading) {
    extraProps.scope = "col";
  }

  return (
    <Elm {...extraProps} {...delegated} width={width}>
      <div
        className={clsx(
          overrideStyle ? className : TableClasses[Elm],
          !overrideStyle && className,
          !wrap && "whitespace-nowrap"
        )}
      >
        {children}
      </div>
    </Elm>
  );
};
