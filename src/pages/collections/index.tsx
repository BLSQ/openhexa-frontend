import { createGetServerSideProps } from "libs/page";

const CollectionsPage = () => {
  return <div>collections</div>;
};

export const getServerSideProps = createGetServerSideProps({
  requireAuth: true,
});

export default CollectionsPage;
