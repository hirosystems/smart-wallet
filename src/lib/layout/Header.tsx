import { Box, Flex } from '@chakra-ui/react';

import ConnectWallet from '../components/ConnectWallet';

const Header = () => {
  return (
    <Flex
      as="nav"
      width="full"
      align="center"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '1em',
        background: '#333',
        color: 'white',
      }}
    >
      <Box marginLeft="auto">
        <ConnectWallet />
      </Box>
    </Flex>
  );
};

export default Header;
