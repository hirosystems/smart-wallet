import { Box, Flex } from '@chakra-ui/react';

import ConnectWallet from '../components/ConnectWallet';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Box marginLeft="auto">
        <ConnectWallet />
      </Box>
    </Flex>
  );
};

export default Header;
