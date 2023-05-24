import { Box, Button, FormLabel, Input, Tooltip } from '@chakra-ui/react';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  broadcastTransaction,
  makeContractDeploy,
} from '@stacks/transactions';
import { readFileSync } from 'fs';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';

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

function deployWallet() {
  // for mainnet, use `StacksMainnet()`
  const network = new StacksTestnet();

  const txOptions = {
    contractName: 'contract_name',
    codeBody: readFileSync('/path/to/contract.clar').toString(),
    senderKey:
      'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractDeploy(txOptions);

  const broadcastResponse = await broadcastTransaction(transaction, network);
  const txId = broadcastResponse.txid;
}

function createWallet() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    control,
  } = useForm();
  const onSubmit = (data) => console.log(data); // TODO: submit to API
  const router = useRouter();

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Box>
      <Box> This info will be used to notify about your wallet activity </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Controller
            name="Email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <>
                <FormLabel>Email</FormLabel>
                <Input type="text" size="lg" {...field} />
              </>
            )}
          />
          <Controller
            name="Phone Number"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Invalid phone number',
              },
            }}
            render={({ field }) => (
              <>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" {...field} size="lg" />
              </>
            )}
          />
        </Box>
        <Button type="submit">Submit</Button>

        {/* Button that can only be clicked after the form has been submitted */}
        <Box>
          <Tooltip
            label={
              !isSubmitted
                ? 'User details are required before deploying your smart wallet'
                : ''
            }
            hasArrow
          >
            <Button isDisabled={!isSubmitted} onClick={deployWallet}>
              Deploy Smart Wallet
            </Button>
          </Tooltip>
        </Box>
      </form>
    </Box>
  );
}

export default createWallet;
