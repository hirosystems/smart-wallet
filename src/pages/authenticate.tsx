import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  hexToCV,
  makeContractSTXPostCondition,
  uintCV,
} from '@stacks/transactions';
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

function Authenticate() {
  // get the params address
  const router = useRouter();

  const { doContractCall } = useConnect();
  // Get the query parameter from the URL
  const { ownerAddress, contractAddress, txid } = router.query;
  console.log(ownerAddress, contractAddress);

  const { isWalletConnected, mainnetAddress } = useContext(HiroWalletContext);
  console.log(isWalletConnected, mainnetAddress);

  async function getPendingTx(txid) {
    const body = JSON.stringify({
      sender: ownerAddress,
      arguments: [uintCV(txid)],
    });
    const url = `${API_URL}/v2/contracts/call-read/${SMART_WALLET_CONTRACT_ADDRESS}/${SMART_WALLET_CONTRACT_NAME}/get-pending-tx`;

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('data from get-pending-tx', data);
    const result = hexToCV(data.result);
    return result;
  }

  async function cosignTx(txId) {
    const tx = await getPendingTx(txId);
    console.log('tx', tx);
    const amount = 0;
    // const pc = makeContractSTXPostCondition(
    //   SMART_WALLET_CONTRACT_ADDRESS,
    //   SMART_WALLET_CONTRACT_NAME,
    //   FungibleConditionCode.LessEqual,
    //   amount
    // );
    doContractCall({
      network: new StacksTestnet({ url: API_URL }),
      anchorMode: AnchorMode.Any,
      contractAddress: SMART_WALLET_CONTRACT_ADDRESS,
      contractName: SMART_WALLET_CONTRACT_NAME,
      functionName: 'cosign-tx',
      functionArgs: [uintCV(txId)],
      postConditionMode: PostConditionMode.Allow,
      // postConditions: [pc],
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
          <Flex direction="column">
            <Text fontSize="xl" fontWeight="bold">
              Authenticate a transaction as a co-signer
            </Text>

            <Flex direction="row">
              <Button
                m={2}
                mt={8}
                onClick={() => cosignTx(txid)}
                variant="primary"
              >
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
}

export default Authenticate;
