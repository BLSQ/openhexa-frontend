import { PlusIcon } from "@heroicons/react/outline";
import CollectionsTable from "collections/features/CollectionsTable";
import CreateCollectionDialog from "collections/features/ManageCollectionItemDialog";
import {
  CollectionsPageDocument,
  useCollectionsPageQuery,
} from "collections/graphql/queries.generated";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import Button from "core/components/Button";
import { PageContent } from "core/components/Layout/PageContent";
import { createGetServerSideProps } from "core/helpers/page";
import Toggle from "core/helpers/Toggle";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback } from "react";

type Props = {
  page: number;
  perPage: number;
};

const CollectionsPage = (props: Props) => {
  const { t } = useTranslation();
  const { data } = useCollectionsPageQuery({
    variables: {
      page: props.page,
      perPage: props.perPage,
    },
  });
  const router = useRouter();

  const onChangePage = useCallback(
    (page: number) =>
      router.push({ pathname: router.pathname, query: { page } }),
    [router]
  );

  if (!data) {
    return null;
  }

  return (
    <PageContent>
      <Breadcrumbs className="my-8 px-2">
        <Breadcrumbs.Part href="/collections">
          {t("Collections")}
        </Breadcrumbs.Part>
      </Breadcrumbs>
      <div className="space-y-4">
        <div className="flex justify-end">
          {true && (
            <Toggle>
              {({ isToggled, toggle }) => (
                <>
                  <Button onClick={toggle}>
                    <PlusIcon className="mr-1 h-4" />
                    {t("Create")}
                  </Button>
                  <CreateCollectionDialog open={isToggled} onClose={toggle} />
                </>
              )}
            </Toggle>
          )}
        </div>
        <Block>
          <CollectionsTable
            page={data.collections}
            perPage={props.perPage}
            onChangePage={onChangePage}
          />
        </Block>
      </div>
    </PageContent>
  );
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
  getServerSideProps: async (ctx, client) => {
    const page = (ctx.query.page as string)
      ? parseInt(ctx.query.page as string, 10)
      : 1;
    const perPage = 15;
    await client.query({
      query: CollectionsPageDocument,
      variables: {
        page,
        perPage,
      },
    });
    return { props: { page, perPage } };
  },
});

export default CollectionsPage;
