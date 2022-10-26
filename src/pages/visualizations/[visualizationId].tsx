import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import DataCard from "core/components/DataCard";
import CountryProperty from "core/components/DataCard/CountryProperty";
import DateProperty from "core/components/DataCard/DateProperty";
import RenderProperty from "core/components/DataCard/RenderProperty";
import { OnSaveFn } from "core/components/DataCard/Section";
import TagProperty from "core/components/DataCard/TagProperty";
import TextProperty from "core/components/DataCard/TextProperty";
import UserProperty from "core/components/DataCard/UserProperty";
import Page from "core/components/Layout/Page";
import { PageContent } from "core/components/Layout/PageContent";
import Spinner from "core/components/Spinner";
import { ensureArray } from "core/helpers/array";
import { createGetServerSideProps } from "core/helpers/page";
import useCacheKey from "core/hooks/useCacheKey";
import useToggle from "core/hooks/useToggle";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import VisualizationPicture from "visualizations/features/VisualizationPicture";
import { VisualizationPicture_VisualizationFragment } from "visualizations/features/VisualizationPicture.generated";
import {
  useVisualizationQuery,
  VisualizationDocument,
  VisualizationQuery,
  VisualizationsPageQuery,
} from "visualizations/graphql/queries.generated";

type Props = {
  visualizationId: string;
};

const VisualizationPage = ({ visualizationId }: Props) => {
  const { t } = useTranslation();

  const { data, refetch } = useVisualizationQuery({
    variables: { id: visualizationId },
  });

  if (!data?.externalDashboard) {
    return null;
  }

  const { externalDashboard } = data;

  return (
    <Page title={externalDashboard.name}>
      <PageContent>
        <Breadcrumbs className="my-8 px-2">
          <Breadcrumbs.Part href="/visualizations">
            {t("External Dashboard")}
          </Breadcrumbs.Part>
          <Breadcrumbs.Part
            href={{
              pathname: "/visualizations/[visualizationId]",
              query: { visualizationId: externalDashboard.id },
            }}
          >
            {externalDashboard.name}
          </Breadcrumbs.Part>
        </Breadcrumbs>
        <div className="space-y-10">
          <DataCard item={externalDashboard}>
            <DataCard.Heading<typeof externalDashboard> titleAccessor="name">
              {() => (
                <div>
                  <div className="flex items-center">
                    <VisualizationPicture visualization={externalDashboard} />
                    <div className="ml-4 w-full truncate">
                      <div
                        className="truncate text-sm font-medium text-gray-900"
                        title={externalDashboard.name}
                      >
                        {externalDashboard.name}
                      </div>
                      <div className="truncate text-sm text-gray-500">
                        <span>External Dashboard</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DataCard.Heading>
            <DataCard.Section title={t("Information")}>
              <RenderProperty id="url" label={t("Url")}>
                {(item) => (
                  <a
                    href={externalDashboard.url}
                    className="block flex items-center text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    {externalDashboard.url}
                  </a>
                )}
              </RenderProperty>
            </DataCard.Section>
            <DataCard.Section title={t("OpenHexa Metadata")} onSave={() => {}}>
              <TextProperty
                required
                id="name"
                accessor="label"
                label={t("Label")}
                defaultValue="-"
              />
              <TextProperty
                id="description"
                accessor="description"
                label={t("Description")}
                defaultValue="-"
              />
              <UserProperty id="owner" accessor="owner" label={t("Owner")} />
              <TagProperty
                id="tags"
                accessor="tags"
                label={t("Tags")}
                defaultValue="-"
              />
              <CountryProperty
                id="countries"
                accessor="countries"
                multiple
                label={t("Location")}
                defaultValue="-"
              />
            </DataCard.Section>
          </DataCard>
        </div>
      </PageContent>
    </Page>
  );
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  async getServerSideProps(ctx, client) {
    const { data } = await client.query<VisualizationQuery>({
      query: VisualizationDocument,
      variables: {
        id: ctx.params?.visualizationId,
      },
    });

    if (!data.externalDashboard) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        visualizationId: ctx.params?.visualizationId,
      },
    };
  },
});

export default VisualizationPage;
