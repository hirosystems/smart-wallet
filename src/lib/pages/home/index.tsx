import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';

import { Balances } from '~/lib/components/Balances';
import { DepositStx } from '~/lib/components/DepositStx';
import HiroWalletContext from '~/lib/components/HiroWalletContext';
import { useHardcodedSmartWallet } from '~/lib/hooks/use-smart-wallet';

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
  } = useHardcodedSmartWallet();

  // const {
  //   hasSmartWallet,
  //   isLoading: isSmartWalletLoading,
  //   error,
  // } = useSmartWallet();

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
      border="1px solid white"
      padding="30px"
    >
      <NextSeo title="Home" />
      <Text fontSize="xl" fontWeight="bold" textAlign="center">
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
      ) : // <Box>Show wallet</Box>
      null}
      {!isWalletConnected ? (
        <Button className="Connect" onClick={authenticate}>
          Connect Wallet
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
      <Box>
        <Heading>Smart Wallet Actions</Heading>
        <Flex>
          <HStack>
            {isWalletConnected && hasSmartWallet ? (
              <Link href={{ pathname: '/add-signer' }}>
                <Button>
                  Add Co-signer
                </Button>
              </Link>
            ) : null}
            {hasSmartWallet ? <DepositStx /> : null}
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;
