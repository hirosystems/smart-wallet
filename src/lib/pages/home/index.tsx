import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useContext } from 'react';

import { Balances } from '~/lib/components/Balances';
import HiroWalletContext from '~/lib/components/HiroWalletContext';

const Home = () => {
  const { authenticate, isWalletConnected, mainnetAddress, disconnect } =
    useContext(HiroWalletContext);
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <NextSeo title="Home" />
      <Balances />
      <Text fontSize="xl" fontWeight="bold">
        With the Smart Wallet you add a layer of security to your STX tokens.
        With our 2 of 2 multisig wallet you can be sure that your tokens are
        safe.
      </Text>
      {!isWalletConnected ? (
        <Link
          as="Button"
          href={{ pathname: '/authenticate', query: { address: '' } }}
        >
          Authenticate
        </Link>
      ) : null}
      {isWalletConnected ? (
        <Link href={{ pathname: '/add-signer' }}>Add Co-signer</Link>
      ) : null}
    </Flex>
  );
};

export default Home;
