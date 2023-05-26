import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { authenticate } from '@stacks/connect';
import { AnchorMode, cvToString, cvToValue, hexToCV, PostConditionMode, standardPrincipalCVFromAddress } from '@stacks/transactions';
import { stringCV } from '@stacks/transactions/dist/clarity/types/stringCV';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';

import { Balances } from '~/lib/components/Balances';
import { DepositStx } from '~/lib/components/DepositStx';
import HiroWalletContext from '~/lib/components/HiroWalletContext';
import { useHardcodedSmartWallet } from '~/lib/hooks/use-smart-wallet';
import { API_URL, SMART_WALLET_CONTRACT_ADDRESS, SMART_WALLET_CONTRACT_NAME } from '~/lib/modules/constants';
import { signers } from '~/pages/api/store';

const Home = () => {
  const { authenticate, isWalletConnected, mainnetAddress, disconnect, testnetAddress } =
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

  async function getPendingTxs() {
    // const args = functionArgs.map(arg => cvToHex(arg));
    const body = JSON.stringify({
      sender: testnetAddress,
      arguments: [],
    });
    const url = `${API_URL}/v2/contracts/call-read/${SMART_WALLET_CONTRACT_ADDRESS}/${SMART_WALLET_CONTRACT_NAME}/get-pending-txs`;

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const data =  await response.json();
    console.log('get pending txs data', data)
    const result = hexToCV(data.result)
    return result
  }

  const [pendingTxs, setPendingTxs] = useState([]);

  useEffect(() => {
    if (!testnetAddress) return;
    async function getTxs() {
      const result = await getPendingTxs();
      if (!result) return;
      console.log('got result', result);
      const formatted = result.list.map((item) => {
        const owner = cvToString(item.data.owner);
        const recipientAddress = cvToString(item.data.recipient)
        const txid = cvToString(item.data.txid)
        const amount = cvToString(item.data['amount-or-id']);
        return { owner, recipientAddress, txid, amount }
      });
      console.log('formatted', formatted);
      setPendingTxs(formatted);
    }
    getTxs();
  }, [testnetAddress]);

  // const obj = {"okay":true,"result":"0x0b000000010c000000070c616d6f756e742d6f722d6964010000000000000000000000000605234008636f6e74726163740909636f7369676e6572730b00000000046d656d6f0a020000000474657374056f776e6572051a6d78de7b0625dfbfc16c3a8a5735f6dc3dc3f2ce09726563697069656e74051a98eb2088ca98b5f4f38ed84d2ffd5ec1289b2c0704747869640100000000000000000000000000000000"}
  // const objc = {}

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
      {pendingTxs && pendingTxs?.length > 0 ? (
        <>
        <Text>Pending Transactions</Text>
        <VStack spacing={4} align="stretch">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Txid</Th>
                <Th>Recipient Address</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
              <Tbody>
                <>
                  {pendingTxs && pendingTxs.length > 0 && pendingTxs.map((item) => {
                    return (<Tr key={item} >
                      <Td>{item['txid']}</Td>
                      <Td>{item['recipientAddress']}</Td>
                      <Td>{item['amount']}</Td>
                    </Tr>)
                  })}
                </>
              </Tbody>
            </Table>
        </VStack>
        </>
      ) : null}
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
            <Link href="/send">
              <Button mt={8} colorScheme="teal" type="submit" variant="primary">
               Send a transaction
              </Button>
            </Link>
            <Link href="/rules">
              <Button mt={8} colorScheme="teal" type="submit">
               Set Rules 
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;
