import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode, uintCV } from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { Router, useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useContext } from 'react';

import HiroWalletContext from '~/lib/components/HiroWalletContext';
import {
  API_URL,
  EXPLORER_URL,
  SMART_WALLET_CONTRACT_ADDRESS,
  SMART_WALLET_CONTRACT_NAME,
} from '~/lib/modules/constants';
import { signers } from './api/store';

export const getServerSideProps: GetServerSideProps<{
  repo: any;
}> = async () => {
  return { props: { signers } };
};

function Authenticate () {
  // get the params address
  const router = useRouter();

  const { doContractCall } = useConnect();
  // Get the query parameter from the URL
  const { ownerAddress, contractAddress, txid } = router.query;
  console.log(ownerAddress, contractAddress);

  const { isWalletConnected, mainnetAddress } = useContext(HiroWalletContext);
  console.log(isWalletConnected, mainnetAddress);
  function cosignTx(txId) {
    doContractCall({
      network: new StacksTestnet({ url: API_URL }),
      anchorMode: AnchorMode.Any,
      contractAddress: SMART_WALLET_CONTRACT_ADDRESS,
      contractName: SMART_WALLET_CONTRACT_NAME,
      functionName: 'cosign-tx',
      functionArgs: [uintCV(txId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
        fetch('/api/send-owner-notification', {
          method: 'POST',
          body: JSON.stringify({
            stxAddress: ownerAddress,
            txId: data.txId,
          }),
        }).then((response) => response.json());
        window.open(
          `${EXPLORER_URL}/txid/${data.txId}?chain=testnet`,
          '_blank'
        );
      },
      onCancel: () => {
        console.log('onCancel:', 'Transaction was canceled');
      },
    });
  }
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="top"
      minHeight="100vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Box>
        {!isWalletConnected ? (
          <Text fontSize="xl" fontWeight="bold">
            Authenticate to interact with contract {contractAddress}
          </Text>
        ) : null}
        {isWalletConnected ? (
          <Flex direction="column" >
            <Text fontSize="xl" fontWeight="bold">
              Authenticate a transaction as a co-signer
            </Text>

            <Flex direction="row" >
              <Button m={2} mt={8} onClick={() => cosignTx(txid)} variant="primary">
                Confirm Transaction {txid}
              </Button>
              <Button m={2} mt={8}>
                <a
                  href={`${EXPLORER_URL}/txid/${txid}?chain=testnet`}
                  target="_blank"
                >
                  View Transaction
                </a>
              </Button>

            </Flex>
          </Flex>
        ) : null}
      </Box>
      <Box />
    </Flex>
  );
};

export default Authenticate;
