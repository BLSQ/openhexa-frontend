import { gql } from "@apollo/client";
import {
  DownloadPipelineVersion_PipelineFragment,
  DownloadPipelineVersion_VersionFragment,
} from "./DownloadPipelineVersion.generated";
import { downloadPipelineVersion } from "pipelines/helpers/pipeline";
import { set } from "lodash";
import { useState } from "react";

type DownloadPipelineVersionProps = {
  pipeline: DownloadPipelineVersion_PipelineFragment;
  version: DownloadPipelineVersion_VersionFragment;
  children({
    onClick,
    isDownloading,
  }: {
    onClick(): void;
    isDownloading: boolean;
  }): React.ReactElement;
};
const DownloadPipelineVersion = (props: DownloadPipelineVersionProps) => {
  const { version, children } = props;
  const [isDownloading, setDownloading] = useState(false);
  const onClick = () => {
    setDownloading(true);
    downloadPipelineVersion(version.id);
    setDownloading(false);
  };

  return children({ onClick, isDownloading });
};

DownloadPipelineVersion.fragments = {
  version: gql`
    fragment DownloadPipelineVersion_version on PipelineVersion {
      id
      number
    }
  `,
  pipeline: gql`
    fragment DownloadPipelineVersion_pipeline on Pipeline {
      id
      code
    }
  `,
};

export default DownloadPipelineVersion;
