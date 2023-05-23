import { Flex, Link, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">
        {new Date().getFullYear()} -{' '}
        <Link href="" isExternal rel="noopener noreferrer">
          Smart Wallet
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
