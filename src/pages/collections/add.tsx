import ManageCollectionItemDialog from "collections/features/ManageCollectionItemDialog";
import Block from "core/components/Block";
import Breadcrumbs from "core/components/Breadcrumbs";
import CurrentLayout from "core/layouts";
import { createGetServerSideProps } from "core/helpers/page";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const AddToCollectionsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const element = {
    model: router.query.model as string,
    app: router.query.app as string,
    id: router.query.objectId as string,
  };

  const onClose = () => {
    router.push((router.query.redirect as string) || "/");
  };

  return (
    <CurrentLayout.PageContent>
      <Breadcrumbs className="my-8 px-2">
        <Breadcrumbs.Part href="/collections">
          {t("Collections")}
        </Breadcrumbs.Part>
      </Breadcrumbs>
      <div className="space-y-4">
        <Block className="h-96">
          <ManageCollectionItemDialog
            element={element}
            open
            onClose={onClose}
          />
        </Block>
      </div>
    </CurrentLayout.PageContent>
  );
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default AddToCollectionsPage;
