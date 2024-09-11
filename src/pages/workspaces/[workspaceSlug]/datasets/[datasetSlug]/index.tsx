import DataCard from "core/components/DataCard";
import TextProperty from "core/components/DataCard/TextProperty";
import Page from "core/components/Page";
import { createGetServerSideProps } from "core/helpers/page";
import { NextPageWithLayout } from "core/helpers/types";
import DatasetVersionFilesDataGrid from "datasets/features/DatasetVersionFilesDataGrid/DatasetVersionFilesDataGrid";
import { useTranslation } from "next-i18next";
import {
  useWorkspaceDatasetPageQuery,
  WorkspaceDatasetPageDocument,
  WorkspaceDatasetPageQuery,
  WorkspaceDatasetPageQueryVariables,
} from "workspaces/graphql/queries.generated";
import UserProperty from "../../../../../core/components/DataCard/UserProperty";
import DateProperty from "../../../../../core/components/DataCard/DateProperty";
import { useEffect } from "react";
import { updateDataset } from "datasets/helpers/dataset";
import DescriptionList from "core/components/DescriptionList";
import Time from "core/components/Time";
import useCacheKey from "core/hooks/useCacheKey";
import RenderProperty from "core/components/DataCard/RenderProperty";
import Clipboard from "core/components/Clipboard";
import { trackEvent } from "core/helpers/analytics";
import DatasetLayout from "datasets/layouts/DatasetLayout";

export type WorkspaceDatabasePageProps = {
  datasetSlug: string;
  workspaceSlug: string;
  versionId: string;
  isSpecificVersion: boolean;
  tabIndex: number;
};

const WorkspaceDatasetPage: NextPageWithLayout = (
  props: WorkspaceDatabasePageProps,
) => {
  const { datasetSlug, workspaceSlug, isSpecificVersion, versionId } = props;

  const { t } = useTranslation();
  const { data, refetch } = useWorkspaceDatasetPageQuery({
    variables: {
      workspaceSlug,
      datasetSlug,
      versionId,
      isSpecificVersion,
    },
  });
  useCacheKey(["datasets"], () => refetch());

  useEffect(() => {
    if (data?.datasetLink) {
      const version = dataset.version || dataset.latestVersion || null;
      trackEvent("datasets.dataset_open", {
        workspace: workspaceSlug,
        dataset_id: datasetSlug,
        dataset_version: version?.name,
      });
    }
  }, []);

  if (!data?.datasetLink) {
    return null;
  }
  const { datasetLink } = data;
  const { dataset, workspace } = datasetLink;
  const isWorkspaceSource = workspace.slug === dataset.workspace?.slug;
  const version = dataset.version || dataset.latestVersion || null;

  const onSave = async (values: any) => {
    await updateDataset(datasetLink.dataset.id, values);
  };

  return (
    <Page title={datasetLink.dataset.name ?? t("Dataset")}>
      <DatasetLayout
        datasetLink={data.datasetLink}
        workspace={workspace}
        tab="description"
      >
        <DataCard
          item={datasetLink.dataset}
          className="divide-y-2 space-y-2 divide-gray-100 shadow-none"
        >
          <DataCard.FormSection
            title={t("General informations")}
            onSave={
              datasetLink.dataset.permissions.update && isWorkspaceSource
                ? onSave
                : undefined
            }
            collapsible={false}
            className="-ml-5"
          >
            <TextProperty
              id="name"
              accessor={"name"}
              label={t("Name")}
              visible={(_, isEditing) => isEditing}
            />
            <TextProperty
              id="description"
              accessor={"description"}
              label={t("Description")}
              defaultValue="Empty description"
              hideLabel
              markdown
            />
            <RenderProperty
              id="slug"
              accessor="slug"
              label={t("Identifier")}
              help={t(
                "The identifier is used to reference the dataset in the SDK and notebooks",
              )}
              readonly
            >
              {(property) => (
                <div className="font-mono">
                  <Clipboard value={property.displayValue}>
                    {property.displayValue}
                  </Clipboard>
                </div>
              )}
            </RenderProperty>
            <DateProperty
              id={"createdAt"}
              label={t("Created at")}
              accessor={"createdAt"}
              readonly
            />
            <UserProperty
              id={"createdBy"}
              readonly
              label={t("Created by")}
              accessor={"createdBy"}
            />
            <TextProperty
              readonly
              id={"workspace"}
              accessor={"workspace.name"}
              label={t("Source workspace")}
            />
          </DataCard.FormSection>
          <DataCard.Section
            title={() => (
              <div className="flex flex-1 gap-2 items-center justify-between">
                <h4 className="flex-1 font-medium">
                  {!version && t("Versions")}
                  {version &&
                    version.id === datasetLink.dataset.latestVersion?.id &&
                    t("Latest version")}
                  {version &&
                    version.id !== datasetLink.dataset.latestVersion?.id &&
                    t("Version {{version}}", {
                      version: version.name,
                    })}
                </h4>
              </div>
            )}
            collapsible={false}
            className="-ml-5"
          >
            {version ? (
              <>
                <DescriptionList>
                  <DescriptionList.Item label={t("Name")}>
                    {version.name}
                  </DescriptionList.Item>
                  <DescriptionList.Item label={t("Created at")}>
                    <Time datetime={version.createdAt} />
                  </DescriptionList.Item>
                  <DescriptionList.Item label={t("Created by")}>
                    {version.createdBy?.displayName ?? "-"}
                  </DescriptionList.Item>
                </DescriptionList>
              </>
            ) : (
              <p className={"italic text-gray-500"}>
                {t(
                  "This dataset has no version. Upload a new version using your browser or the SDK to see it here.",
                )}
              </p>
            )}
          </DataCard.Section>
        </DataCard>
      </DatasetLayout>
    </Page>
  );
};

WorkspaceDatasetPage.getLayout = (page) => page;

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const versionId = (ctx.query.version as string) ?? "";

    const variables = {
      workspaceSlug: ctx.params!.workspaceSlug as string,
      datasetSlug: ctx.params!.datasetSlug as string,
      versionId: versionId,
      isSpecificVersion: Boolean(versionId),
    };

    const { data } = await client.query<
      WorkspaceDatasetPageQuery,
      WorkspaceDatasetPageQueryVariables
    >({
      query: WorkspaceDatasetPageDocument,
      variables,
    });

    if (!data.datasetLink) {
      return { notFound: true };
    }
    // If we have a versionId or there is a version in the dataset, prefetch the files
    if (versionId || data.datasetLink.dataset.latestVersion?.id) {
      await DatasetVersionFilesDataGrid.prefetch(client, {
        perPage: 10,
        versionId: (versionId ||
          data.datasetLink.dataset.latestVersion?.id) as string,
      });
    }

    return {
      props: variables,
    };
  },
});

export default WorkspaceDatasetPage;
