import _ from "lodash";
import { useMemo } from "react";
import { BaseColumnProps } from "./BaseColumn";
import { useCellContext } from "./helpers";

type TextColumnProps = BaseColumnProps & {
  textPath: string;
  subtextPath?: string;
};

export function TextColumn(props: TextColumnProps) {
  const { textPath, subtextPath } = props;
  const cell = useCellContext();

  const text = useMemo(
    () => _.get(cell.value, textPath),
    [cell.value, textPath]
  );
  const subtext = useMemo(
    () => (subtextPath ? _.get(cell.value, subtextPath) : "-"),
    [cell.value, subtextPath]
  );

  return (
    <div className="w-full">
      <div title={text} className="truncate text-gray-600 lg:whitespace-nowrap">
        {text}
      </div>
      {subtextPath && (
        <div className="mt-1 text-xs text-gray-400">{subtext}</div>
      )}
    </div>
  );
}
