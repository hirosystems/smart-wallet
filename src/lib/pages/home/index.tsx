import { Box, CircularProgress, Flex, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useContext } from 'react';

import { Balances } from '~/lib/components/Balances';
import HiroWalletContext from '~/lib/components/HiroWalletContext';
import { useSmartWallet } from '~/lib/hooks/use-smart-wallet';

const Home = () => {
  const { authenticate, isWalletConnected, mainnetAddress, disconnect } =
    useContext(HiroWalletContext);

  const {
    hasSmartWallet,
    isLoading: isSmartWalletLoading,
    error,
  } = useSmartWallet();
  console.log('useSmartWallet', {
    hasSmartWallet,
    isSmartWalletLoading,
    error,
  });
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
      {isSmartWalletLoading ? (
        <Box>
          <CircularProgress isIndeterminate color="green.300" />
        </Box>
      ) : hasSmartWallet ? (
        <Box>Deploy wallet</Box>
      ) : (
        <Box>Show wallet</Box>
      )}
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
