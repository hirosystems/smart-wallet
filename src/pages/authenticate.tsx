
import { Flex, Text, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import ConnectWallet, { userSession } from '~/lib/components/ConnectWallet';
import HiroWalletContext from '~/lib/components/HiroWalletContext';

const Authenticate = () => {
  // get the params address
  const router = useRouter();

  // Get the query parameter from the URL
  const { address, contractAddress } = router.query;
  console.log(address, contractAddress)

  const { authenticate, isWalletConnected, mainnetAddress, disconnect } = useContext(HiroWalletContext);
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
        <Text fontSize="xl" fontWeight="bold">
          Authenticate to intereact with contract {contractAddress}
        </Text>
      </Box>
      <Box>
      </Box>
    </Flex>
  );
};

export default Authenticate;
