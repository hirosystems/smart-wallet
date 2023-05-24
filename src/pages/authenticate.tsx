import { Flex, Text, Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import ConnectWallet, { userSession } from '~/lib/components/ConnectWallet';
import HiroWalletContext from '~/lib/components/HiroWalletContext';

const Authenticate = () => {
  // get the params address
  const router = useRouter();

  // Get the query parameter from the URL
  const { ownerAddress, contractAddress, txid } = router.query;
  console.log(ownerAddress, contractAddress);

  const { authenticate, isWalletConnected, mainnetAddress, disconnect } =
    useContext(HiroWalletContext);
  console.log(isWalletConnected, mainnetAddress);
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
        { !isWalletConnected ? <Text fontSize="xl" fontWeight="bold">
          Authenticate to interact with contract {contractAddress}
        </Text> : null }
        { isWalletConnected ?
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              Confirm Transaction
            </Text>
            <Button m={2} onClick={() => console.log('confirm')}>Confirm Transaction</Button>
          </Box>
         : null }
      </Box>
      <Box />
    </Flex>
  );
};

export default Authenticate;
