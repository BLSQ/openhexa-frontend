import BaseDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html className="h-full bg-gray-100">
        <Head>
          <link rel="icon" href="/static/img/favicon.png" />
        </Head>
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
