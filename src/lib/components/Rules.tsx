import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { cvToString, hexToCV } from '@stacks/transactions';
import { useContext, useEffect, useState } from 'react';
import {
  API_URL,
  SMART_WALLET_CONTRACT_ADDRESS,
  SMART_WALLET_CONTRACT_NAME,
} from '../modules/constants';
import HiroWalletContext from './HiroWalletContext';

export const Rules = () => {
  const [stxRules, setStxRules] = useState();
  const { testnetAddress } = useContext(HiroWalletContext);

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

  return (
    <Box>
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
    </Box>
  );
};
