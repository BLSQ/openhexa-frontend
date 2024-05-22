import { gql } from "@apollo/client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Block from "core/components/Block";
import { WebPage_PageFragment } from "./WebPage.generated";

type Props = {
  page: WebPage_PageFragment;
  className?: string;
  showRefresh?: boolean;
};

const WebPage = (props: Props) => {
  const { page, className, showRefresh = false } = props;
  console.log(page);

  if (page.fullWidth) {
    return (
      <section className={clsx(className, "flex-1 h-full")}>
        <iframe
          src={page.url}
          width="100%"
          height="100%"
          allow=""
          allowFullScreen
          allowTransparency
          tabIndex={0}
        />
      </section>
    );
  }
  return (
    <Block as="section" className={clsx(className, "relative")}>
      <Block.Header className="flex items-center justify-between">
        {page.title}
        {showRefresh && (
          <button>
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        )}
      </Block.Header>
      <div style={{ height: page.height ?? "100%" }}>
        <iframe
          src={page.url}
          width="100%"
          height="100%"
          allowFullScreen
          allowTransparency
          tabIndex={0}
        />
      </div>
    </Block>
  );
};

WebPage.fragments = {
  page: gql`
    fragment WebPage_page on WebPage {
      id
      title
      url
      fullWidth
      height
      url
    }
  `,
};

export default WebPage;
