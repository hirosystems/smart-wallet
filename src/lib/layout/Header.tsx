import { Box, Flex } from '@chakra-ui/react';

import ThemeToggle from './ThemeToggle';
import ConnectWallet from '../components/ConnectWallet';

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
