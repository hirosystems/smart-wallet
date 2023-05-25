import { Box, Button, CircularProgress, Flex, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';

import { Balances } from '~/lib/components/Balances';
import HiroWalletContext from '~/lib/components/HiroWalletContext';
import { useSmartWallet } from '~/lib/hooks/use-smart-wallet';

const Home = () => {
  const { authenticate, isWalletConnected, mainnetAddress, disconnect } =
    useContext(HiroWalletContext);
  const router = useRouter();

  const navigateToCreateWallet = useCallback(() => {
    router.push('/create-wallet');
  }, [router]);

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
      <Text fontSize="xl" fontWeight="bold">
        With the Smart Wallet you add a layer of security to your STX tokens.
        With our 2 of 2 multisig wallet your can be sure that your tokens are
        safe.
      </Text>
      <Balances />
      {isSmartWalletLoading ? (
        <Box>
          <CircularProgress isIndeterminate color="green.300" />
        </Box>
      ) : !hasSmartWallet && isWalletConnected ? (
        <Button onClick={navigateToCreateWallet}>Deploy Smart Wallet</Button>
      ) : (
        // <Box>Show wallet</Box>
        null
      )}
      {!isWalletConnected ? (
        <Button className="Connect" onClick={authenticate}>
          Connect Wallet
        </Button>
      ) : null }
      {isWalletConnected ? (
        <Button>
          <Link
            href={{ pathname: '/add-signer'}}
          >
            Add Co-signer
          </Link>
        </Button>
      ) : null}

      {/* {!isWalletConnected ? (
        <Button>
          <Link
            href={{ pathname: '/authenticate', query: { address: '' } }}
          >
            Authenticate
          </Link>
        </Button>
      ) : null} */}
      {isWalletConnected && hasSmartWallet ? (
        <Link href={{ pathname: '/add-signer' }}>Add Co-signer</Link>
      ) : null}
    </Flex>
  );
};

export default Home;
