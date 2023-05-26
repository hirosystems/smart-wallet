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
  cvToString,
  hexToCV,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import HiroWalletContext from '~/lib/components/HiroWalletContext';
import {
  API_URL,
  SMART_WALLET_CONTRACT_ADDRESS,
  SMART_WALLET_CONTRACT_NAME,
} from '~/lib/modules/constants';

function fetchSigners(userAddress: string) {
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

  async function getSTXRules() {
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

    const data = await response.json();
    console.log('data from getSTXRule', data);
    const result = hexToCV(data.result);
    return result;
  }

  const [stxRules, setStxRules] = useState();
  // const rules = {"okay": true, "result": "0x0b000000010c000000040c616d6f756e742d6f722d69640100000000000000000000000005f5e100056173736574090269640100000000000000000000000000000000046b696e640100000000000000000000000000000000"}
  useEffect(() => {
    if (!testnetAddress) return;
    async function getRules() {
      const result = await getSTXRules();
      console.log('got result', result);
      const formatted = result.list.map((item) => {
        const amountOrId = cvToString(item.data['amount-or-id']);
        const asset = cvToString(item.data.asset);
        const id = cvToString(item.data.id);
        const kind = cvToString(item.data.kind);
        return { amountOrId, asset, id, kind };
      });
      console.log('formatted', formatted);
      setStxRules(formatted);
    }
    getRules();
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
      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold">
          Add rules to secure your smart wallet for any STX, FT and NFT
          transfer. If a transaction satisfies any of these rules, a
          notification will be sent to your co-signer for approval.
        </Text>
      </Box>
      {stxRules && stxRules?.length > 0 ? (
        <>
          <Text>Active Rules</Text>
          <VStack spacing={4} align="stretch">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Txid</Th>
                  <Th>Recipient Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                <>
                  {stxRules &&
                    stxRules?.length > 0 &&
                    stxRules.map((item) => {
                      return (
                        <Tr key={item}>
                          <Td>{item['amountOrId']}</Td>
                          <Td>{item['asset']}</Td>
                          <Td>{item['id']}</Td>
                          <Td>{item['kind']}</Td>
                        </Tr>
                      );
                    })}
                </>
              </Tbody>
            </Table>
          </VStack>
        </>
      ) : null}

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
      <br />
      <hr />
      <Box width={'100%'}>
        <FormLabel>
          Minimum STX threshold that necessitates a co-signer for executing any
          transfer
        </FormLabel>
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
