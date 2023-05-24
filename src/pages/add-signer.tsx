import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useContext, useState } from 'react';
import Router from 'next/router';


import HiroWalletContext from '~/lib/components/HiroWalletContext';

function fetchSigners(userAddress) {
  return async () => {
    const response = await fetch(`/api/get-signers?userAddress=${userAddress}`);
    const data = await response.json();
    return data.data.signers;
  };
}

function addSignerMutation(userAddress, address, email, phoneNumber) {
  return async () => {
    const response = await fetch('/api/add-signer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, userAddress, email, phoneNumber }),
    });
    return response.json();
  };
}

function AddSigner() {
  const [stxAddress, setStxAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { testnetAddress } = useContext(HiroWalletContext);

  const { data: signers, refetch } = useQuery(
    ['signers', testnetAddress],
    fetchSigners(testnetAddress),
    {
      enabled: !!testnetAddress,
    }
  );

  console.log('signers', signers);

  const mutation = useMutation(
    addSignerMutation(testnetAddress, stxAddress, email, phoneNumber),
    {
      onSuccess: () => {
        refetch();
        setStxAddress('');
        setEmail('');
        setPhoneNumber('');
        // redirect to /send
        Router.push('/send');

      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  // if (!mainnetAddress) {
  //   return null
  // }

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
      {signers && signers.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th isNumeric>#</Th>
                <Th>Co-Signer Address</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signers &&
                signers.map((signer, index) => (
                  <Tr key={index}>
                    <Td isNumeric>{index + 1}</Td>
                    <Td>{signer.address}</Td>
                    <Td>{signer.email}</Td>
                    <Td>{signer.phoneNumber}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </VStack>
      ) : null}
      {signers && signers.length !== 1 ? (
        <>
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              Add Signer
              <br />
            </Text>
          </Box>
          <form onSubmit={handleSubmit}>
            <FormControl id="stxAddress" isRequired>
              <FormLabel>STX Address</FormLabel>
              <Input
                type="text"
                value={stxAddress}
                onChange={(e) => setStxAddress(e.target.value)}
                size="lg"
              />
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
              />
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="lg"
              />
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit">
              Add
            </Button>
            <Link href="/">
              <Button ml={4} mt={4} colorScheme="teal" type="submit">
                Back
              </Button>
            </Link>
          </form>
        </>
      ) : null}
    </Flex>
  );
}

export default AddSigner;
