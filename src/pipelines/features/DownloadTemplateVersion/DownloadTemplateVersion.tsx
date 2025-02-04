import { gql } from "@apollo/client";
import { downloadPipelineVersion } from "pipelines/helpers/pipeline";
import { useState } from "react";
import { DownloadTemplateVersion_VersionFragment } from "./DownloadTemplateVersion.generated";

type DownloadTemplateVersionProps = {
  version: DownloadTemplateVersion_VersionFragment;
  children({
    onClick,
    isDownloading,
  }: {
    onClick(): void;
    isDownloading: boolean;
  }): React.ReactElement;
};
const DownloadTemplateVersion = (props: DownloadTemplateVersionProps) => {
  const { version, children } = props;
  const [isDownloading, setDownloading] = useState(false);
  const onClick = () => {
    setDownloading(true);
    downloadPipelineVersion(version.id); // TODO
    setDownloading(false);
  };

  return children({ onClick, isDownloading });
};

DownloadTemplateVersion.fragments = {
  version: gql`
    fragment DownloadTemplateVersion_version on PipelineTemplateVersion {
      id
      #      name
      #      pipeline {
      #        id
      #        code
      #      }
    }
  `,
};

export default DownloadTemplateVersion;
