import { InformationCircleIcon, PlayIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Badge from "core/components/Badge";
import Block from "core/components/Block";
import Time from "core/components/Time";
import { Dag, DagRun, DagRunStatus } from "graphql-types";
import { capitalize } from "lodash";
import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useMemo } from "react";

interface PipelineDataCardProps {
  dag: Pick<Dag, "id" | "label" | "description"> & {
    runs: Array<
      Pick<DagRun, "id" | "triggerMode" | "status" | "executionDate">
    >;
  };
}

const PipelineDataCardStatus = ({
  status,
  date,
}: {
  status: DagRunStatus;
  date: string;
}) => {
  const { t } = useTranslation();
  let className = useMemo(() => {
    switch (status) {
      case DagRunStatus.Failed:
        return "bg-red-100 text-red-500";
      case DagRunStatus.Queued:
        return "bg-gray-100 text-gray-600";
      case DagRunStatus.Running:
        return "bg-sky-100 text-sky-600";
      case DagRunStatus.Success:
        return "bg-emerald-50 text-emerald-500";
    }
  }, [status]);

  const label = useMemo(() => {
    switch (status) {
      case DagRunStatus.Failed:
        return t("Failed");
      case DagRunStatus.Queued:
        return t("Queued");
      case DagRunStatus.Running:
        return t("Running");
      case DagRunStatus.Success:
        return t("Succeeded");
    }
  }, [status, t]);

  return (
    <Badge className={clsx(className, "m-1 space-x-1")}>
      <span> {`${label} on`}</span>
      <Time className="truncate" format={DateTime.DATE_SHORT} datetime={date} />
    </Badge>
  );
};

const PipelineDataCard = ({ dag }: PipelineDataCardProps) => {
  return (
    <Block className="p-4">
      <section>
        <div className="flex items-end justify-between">
          <div className="truncate">
            <div
              className="truncate text-sm font-medium text-gray-900"
              title={dag.label}
            >
              {dag.label}
            </div>
            <div className="truncate text-sm text-gray-500">
              <span>
                {dag.runs && capitalize(dag.runs[0]?.triggerMode || "")}
              </span>
            </div>
          </div>
          <div>
            {dag.runs && (
              <PipelineDataCardStatus
                status={dag.runs[0].status}
                date={dag.runs[0].executionDate}
              />
            )}
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="text-sm font-normal text-gray-900">
          {dag.description}
        </div>
      </section>
      <section className="mt-5">
        <div className="flex justify-end space-x-4">
          <Link
            className="flex items-end space-x-2 text-blue-500 text-blue-500"
            href={{
              pathname: "/pipelines/[pipelineId]/run/[runId]",
              query: { pipelineId: dag.id, runId: dag.runs[0].id },
            }}
          >
            <PlayIcon className="w-6" />
            <span>Run</span>
          </Link>

          <div className="flex items-end space-x-2 text-blue-500 text-blue-500 hover:cursor-pointer">
            <InformationCircleIcon className="w-6" />
            <span>Usage & details</span>
          </div>
        </div>
      </section>
    </Block>
  );
};

export default PipelineDataCard;
