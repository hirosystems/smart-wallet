import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function fetchSigners(userAddres: string) {
  return async () => {
    if (!userAddress) return;
    const response = await fetch(`/api/get-signers?userAddress=${userAddress}`);
    const data = await response.json();
    return data.data.signers;
  };
}

function Pending() {
  // get the params address
  const router = useRouter();

  // Get the query parameter from the URL
  const { txId } = router.query;

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
        <Text fontSize="sm">
          Waiting for your co-signer to sign the transaction {txId}. You will be
          notified by email and sms when the co-signer has signed the
          transaction.
        </Text>
      </Box>
    </Flex>
  );
}

export default Pending;
