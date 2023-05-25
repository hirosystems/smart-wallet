/* eslint-disable react/jsx-props-no-spreading */
import { Connect } from '@stacks/connect-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';

import { Chakra } from '~/lib/components/Chakra';
import { userSession } from '~/lib/components/ConnectWallet';
import { HiroWalletProvider } from '~/lib/components/HiroWalletContext';
import Layout from '~/lib/layout';
import '~/lib/styles/globals.css';
import defaultSEOConfig from '../../next-seo.config';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// console.log('envs', process.env);

const MyApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();
  return (
    <Chakra>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <DefaultSeo {...defaultSEOConfig} />
      <QueryClientProvider client={queryClient}>
        <Layout>
          <HiroWalletProvider>
            <Connect
              authOptions={{
                appDetails: {
                  name: 'Stacks Next.js Template',
                  icon: '',
                },
                redirectTo: '/',
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
      </QueryClientProvider>
    </Chakra>
  );
};

export default MyApp;
