import { Box, Flex, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import ContractCallVote from '~/lib/components/ContractCallVote';

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <NextSeo title="Home" />
      <Text fontSize="xl" fontWeight="bold">
        With the Smart Wallet you add a layer of security to your STX tokens.
        With our 2 of 3 multisig wallet you can be sure that your tokens are safe.
      </Text>
      <Link href={{ pathname: '/authenticate', query: { address: '' } }}>Authenticate</Link>
      <ContractCallVote />
    </Flex>
  );
};

export default Home;
