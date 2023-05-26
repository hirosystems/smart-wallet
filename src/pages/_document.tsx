/* eslint-disable react/jsx-props-no-spreading */
import { ColorModeScript } from '@chakra-ui/react';
import { Connect } from '@stacks/connect-react';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import theme from "../theme";

import Meta from '~/lib/components/Meta';

class MyDocument extends Document {
  static getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/fonts/AeonikFono/AeonikFono-Regular.woff2"
            as="font"
            crossOrigin="anonymous"
            type="font/woff2"
          />
          <Meta />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
