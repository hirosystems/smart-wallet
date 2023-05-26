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
import { test } from '@playwright/test';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  OptionalCV,
  PostConditionMode,
  bufferCVFromString,
  serializeCV,
  someCV,
  stringUtf8CV,
  uintCV,
} from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { getRecipientAddress } from '@stacks/ui-utils';
import { useQuery } from '@tanstack/react-query';
import Router, { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import HiroWalletContext from '~/lib/components/HiroWalletContext';
import {
  SMART_WALLET_CONTRACT_ADDRESS,
  SMART_WALLET_CONTRACT_NAME,
  API_URL,
} from '~/lib/modules/constants';
import { cvToHex } from '~/lib/utils/smart-wallet-utils';

function fetchSigners(userAddress) {
  return async () => {
    if (!userAddress) return;
    const response = await fetch(`/api/get-signers?userAddress=${userAddress}`);
    const data = await response.json();
    return data.data.signers;
  };
}

function Rules() {
  // get the params address
  const router = useRouter();

  const { doContractCall } = useConnect();

  const [amount, setAmount] = useState('1');
  const [recipientAddress, setRecipientAddress] = useState('ST2CEP848SACBBX7KHVC4TBZXBV0JH6SC0WF439NF');
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

  async function getSTXRule() {
    // const args = functionArgs.map(arg => cvToHex(arg));
    const body = JSON.stringify({
      sender: testnetAddress,
      arguments: [],
    });
    const url = `${API_URL}/v2/contracts/call-read/${SMART_WALLET_CONTRACT_ADDRESS}/${SMART_WALLET_CONTRACT_NAME}/get-rules`;

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return response.json();
  }

  useEffect(() => {
    if (!testnetAddress) return;
    getSTXRule()
  }, [testnetAddress]);


  function addSTXRule(amount) {
    doContractCall({
      network: new StacksTestnet({ url: API_URL }),
      anchorMode: AnchorMode.Any,
      contractAddress: SMART_WALLET_CONTRACT_ADDRESS,
      contractName: SMART_WALLET_CONTRACT_NAME,
      functionName: 'add-stx-rule',
      functionArgs: [uintCV(amount * 1_000_000)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
       window.location.reload(); 
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
      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold">
          Add rules to secure your smart wallet for any STX, FT and NFT transfer. If a transaction satisfies any of
          these rules, a notification will be sent to your co-signer for approval.
        </Text>
      </Box>
      <br/>
      <hr/>
      <Box width={'100%'}>
        <FormLabel>Minimum STX threshold that necessitates a co-signer for executing any transfer</FormLabel>
        <Input
          placeholder="10"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <Button m={2} onClick={() => addSTXRule(amount)} variant="primary">
          Add rule
        </Button>
      </Box>
    </Flex>
  );
}

export default Rules;
