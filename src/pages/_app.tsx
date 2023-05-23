/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';

import defaultSEOConfig from '../../next-seo.config';
import { Chakra } from '~/lib/components/Chakra';
import Layout from '~/lib/layout';
import '~/lib/styles/globals.css';
import { userSession } from '~/lib/components/ConnectWallet'
import { Connect } from '@stacks/connect-react';
import { HiroWalletProvider } from '~/lib/components/HiroWalletContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Chakra>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <DefaultSeo {...defaultSEOConfig} />
      <Layout>
        <HiroWalletProvider>
          <Connect
            authOptions={{
              appDetails: {
                name: "Stacks Next.js Template",
                icon: '',
              },
              redirectTo: "/",
              onFinish: () => {
                window.location.reload();
              },
              userSession,
            }}
          >
            <Component {...pageProps} />
          </Connect>
        </HiroWalletProvider>
      </Layout>
    </Chakra>
  );
};

export default MyApp;
