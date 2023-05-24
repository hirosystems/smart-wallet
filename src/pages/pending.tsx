import { Flex, Text, Box, Button, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, stringUtf8CV, PostConditionMode } from '@stacks/transactions';
import { useRouter } from 'next/router';

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
  const { txid } = router.query;

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
        <Text fontSize="xl" fontWeight="bold">
          Waiting for your co-signer to sign the transaction.
        </Text>
      </Box>
    </Flex>
  );
}

export default Send;