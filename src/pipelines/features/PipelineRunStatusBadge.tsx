import { gql } from "@apollo/client";
import clsx from "clsx";
import Badge from "core/components/Badge";
import Spinner from "core/components/Spinner";
import { DagRunStatus } from "graphql/types";
import { formatDAGRunStatus } from "pipelines/helpers/format";
import usePipelineRunPoller from "pipelines/hooks/usePipelineRunPoller";
import { useMemo } from "react";
import { PipelineRunStatusBadge_RunFragment } from "./PipelineRunStatusBadge.generated";

type PipelineRunStatusBadgeProps = {
  run: any | PipelineRunStatusBadge_RunFragment; // 'any' the time that we remove the legacy pipelines
  polling?: boolean;
};

const PipelineRunStatusBadge = (props: PipelineRunStatusBadgeProps) => {
  const { run, polling = true } = props;
  usePipelineRunPoller(run, polling);
  let className = useMemo(() => {
    switch (run.status) {
      case DagRunStatus.Stopped:
        return "bg-yellow-100 text-gray-600";
      case DagRunStatus.Failed:
        return "bg-red-100 text-red-500";
      case DagRunStatus.Queued:
        return "bg-gray-100 text-gray-600";
      case DagRunStatus.Running:
      case DagRunStatus.Terminating:
        return "bg-sky-100 text-sky-600";
      case DagRunStatus.Success:
        return "bg-emerald-50 text-emerald-500";
    }
  }, [run.status]);

  const loading = useMemo(() => {
    return (
      run.status === DagRunStatus.Running ||
      run.status === DagRunStatus.Terminating
    );
  }, [run.status]);

  return (
    <Badge className={clsx(className, "flex items-center")}>
      {loading && <Spinner className="mr-1" size="xs" />}
      {formatDAGRunStatus(run.status)}
    </Badge>
  );
};

PipelineRunStatusBadge.fragments = {
  dagRun: gql`
    fragment PipelineRunStatusBadge_dagRun on DAGRun {
      status
    }
  `,
  pipelineRun: gql`
    fragment PipelineRunStatusBadge_run on PipelineRun {
      id
      status
      ...usePipelineRunPoller_run
    }
    ${usePipelineRunPoller.fragments.run}
  `,
};

export default PipelineRunStatusBadge;
