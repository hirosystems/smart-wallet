import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => (
  <Flex
    as="footer"
    h="full"
    align="center"
    justify="space-between"
    fontFamily="caption"
    fontSize={{ base: "xs", md: "sm" }}
    direction={{ base: "column", lg: "row" }}
    gap={{ base: 2, lg: 6 }}
    zIndex={5}
  >
    <Flex justify="center" align="center" gap="2">
      Smart Wallet
    </Flex>
    <Flex gap="4" mb={[2, 2, 2, 0]} align="center">
      <Text>© {new Date().getFullYear()} Hiro Systems PBC</Text>
    </Flex>
  </Flex>
);

export default Footer;
