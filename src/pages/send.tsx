import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  OptionalCV,
  PostConditionMode,
  bufferCVFromString,
  someCV,
  stringUtf8CV,
  uintCV,
} from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { getRecipientAddress } from '@stacks/ui-utils';
import { useQuery } from '@tanstack/react-query';
import Router, { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import HiroWalletContext from '~/lib/components/HiroWalletContext';
import {
  API_URL,
  EXPLORER_URL,
  SMART_WALLET_CONTRACT_ADDRESS,
  SMART_WALLET_CONTRACT_NAME,
} from '~/lib/modules/constants';

function fetchSigners(userAddress) {
  return async () => {
    if (!userAddress) return;
    const response = await fetch(`/api/get-signers?userAddress=${userAddress}`);
    const data = await response.json();
    return data.data.signers;
  };
}

function Send() {
  // get the params address
  const router = useRouter();

  const { doContractCall } = useConnect();
  // Get the query parameter from the URL
  const { address, contractAddress } = router.query;
  console.log(address, contractAddress);

  const [amount, setAmount] = useState('1');
  const [recipientAddress, setRecipientAddress] = useState(
    'ST2CEP848SACBBX7KHVC4TBZXBV0JH6SC0WF439NF'
  );
  const { testnetAddress } = useContext(HiroWalletContext);

  // get the co-signer data
  const { data: signers } = useQuery(
    ['signers', testnetAddress],
    fetchSigners(testnetAddress),
    {
      enabled: !!testnetAddress,
    }
  );
  console.log('data signers', signers);

  function sendSTX(amount) {
    console.log('sendSTX', amount);
    doContractCall({
      network: new StacksTestnet({ url: API_URL }),
      anchorMode: AnchorMode.Any,
      contractAddress: SMART_WALLET_CONTRACT_ADDRESS,
      contractName: SMART_WALLET_CONTRACT_NAME,
      functionName: 'transfer-stx',
      functionArgs: [
        uintCV(amount),
        principalCV(recipientAddress),
        someCV(bufferCVFromString('test')),
      ],
      postConditionMode: PostConditionMode.Allow,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
        fetch('/api/send-message', {
          method: 'POST',
          body: JSON.stringify({
            stxAddress: SMART_WALLET_CONTRACT_ADDRESS,
            txId: data.txId,
          }),
        }).then((response) => response.json());

        // redirect to /pending
        Router.push('/pending?txId=' + data.txId);

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
      {signers && signers.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th isNumeric>#</Th>
                <Th>Co-Signer Address</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signers &&
                signers.map((signer, index) => (
                  <Tr key={index}>
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{signer.address}</Td>
                    <Td>{signer.email}</Td>
                    <Td>{signer.phoneNumber}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </VStack>
      ) : null}
      <Box>
        <Text fontSize="xl" fontWeight="bold">
          Send STX, FT or NFT. For important transaction, your co-signer will be
          notified to sign the transaction after you sign yours.
        </Text>
      </Box>
      <Box width={'100%'}>
        <FormLabel>Recipient Address</FormLabel>
        <Input
          placeholder="Amount"
          onChange={(e) => setRecipientAddress(e.target.value)}
          value={recipientAddress}
        />
        <FormLabel>STX Amount to transfer</FormLabel>
        <Input
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <Button m={2} onClick={() => sendSTX(amount)}>
          Send STX
        </Button>
      </Box>
      <Box>
        <Button m={2}>Send FT</Button>
        <Button m={2}>Send NFT</Button>
      </Box>
      <Box />
    </Flex>
  );
}

export default Send;
