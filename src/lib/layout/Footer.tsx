import { Flex, Link, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex
      as="footer"
      width="full"
      justifyContent="center"
      style={{
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
      }}
    >
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
