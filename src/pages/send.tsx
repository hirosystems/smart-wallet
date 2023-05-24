import { Flex, Text, Box, Button, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, stringUtf8CV, PostConditionMode } from '@stacks/transactions';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ConnectWallet, { userSession } from '~/lib/components/ConnectWallet';
import HiroWalletContext from '~/lib/components/HiroWalletContext';

function fetchSigners(userAddress) {
  return async () => {
    if (!userAddress) return
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
  const { testnetAddress } = useContext(HiroWalletContext);

  // get the co-signer data
  const { data: signers } = useQuery(
    ['signers', testnetAddress],
    fetchSigners(testnetAddress),
    {
      enabled: !!testnetAddress,
    }
  );
  console.log('data signers', signers)

  function sendSTX(pick: any) {
    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: 'ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK',
      contractName: 'example-fruit-vote-contract',
      functionName: 'vote',
      functionArgs: [stringUtf8CV(pick)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
        // send message to the co-signer with a POST request using fetch() to /api/send-sms-message
        fetch('/api/send-sms', {
          method: 'POST',
          body: JSON.stringify({
            phoneNumber: '+14155552671', // TODO
            stxAddress: testnetAddress,
          })
        }).then((response) => response.json())

        window
          .open(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet`,
            '_blank'
          )
          .focus();
          // redirect to /pending
          Router.push('/pending?txId=' + data.txId);
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
          Send STX, FT or NFT. For important transaction, you co-signer will be notified to sign the transaction after you sign yours.
        </Text>
      </Box>
      <Box>
        <Input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} value={amount}/>
        <Button m={2} onClick={() => sendSTX('🍊')}>Send STX</Button>
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