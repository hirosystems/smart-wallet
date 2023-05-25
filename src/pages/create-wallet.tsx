import { Box, Button, FormLabel, Input, Tooltip } from '@chakra-ui/react';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  broadcastTransaction,
  makeContractDeploy,
} from '@stacks/transactions';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import HiroWalletContext from '~/lib/components/HiroWalletContext';
import { smartWalletContract } from '~/lib/contracts/wallet-contract';
import { SMART_WALLET_CONTRACT_NAME } from '~/lib/utils/smart-wallet-utils';

function fetchSigners(userAddress) {
  return async () => {
    const response = await fetch(`/api/get-signers?userAddress=${userAddress}`);
    const data = await response.json();
    return data.data.signers;
  };
}

async function saveWalletOwnerMutation(formData) {
  const response = await fetch('/api/save-owner-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return response.json();
}

async function deployWallet(address: string) {
  // for mainnet, use `StacksMainnet()`
  const network = new StacksTestnet();

  if (!address) {
    throw new Error('No testnet address found');
  }

  const txOptions = {
    contractName: SMART_WALLET_CONTRACT_NAME,
    codeBody: smartWalletContract.source,
    senderKey: address, // TODO: hardcoded for now
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  return broadcastResponse.txid;
  // TODO: save txId to DB?
}

function createWallet() {
  const { testnetAddress } = useContext(HiroWalletContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    control,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      await saveWalletOwnerMutation({ ...data, userAddress: testnetAddress });
    } catch (error) {
      console.error('Error during form submission: ', error);
    }
  };
  const router = useRouter();

  console.log({ errors, isSubmitted });

  const deployWalletOnClickHandler = useCallback((testnetAddress: string) => {
    const deployWalletAsync = async () => {
      // for mainnet, use `StacksMainnet()`
      const txId = await deployWallet(testnetAddress);
      window.open(
        `https://explorer.hiro.so/txid/${txId}?chain=testnet`,
        '_blank'
      );

      router.push('/add-signer');
    };
    deployWalletAsync();
  }, [router]);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Box>
      <Box> This info will be used to notify about your wallet activity </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              //   pattern: {
              //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              //     message: 'Invalid email address',
              //   },
            }}
            render={({ field }) => (
              <>
                <FormLabel>Email</FormLabel>
                <Input type="text" size="lg" {...field} />
              </>
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              //   pattern: {
              //     value: /^[0-9]+$/,
              //     message: 'Invalid phone number',
              //   },
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
            <Button
              isDisabled={!isSubmitted}
              onClick={() => deployWalletOnClickHandler(testnetAddress)}
            >
              Deploy Smart Wallet
            </Button>
          </Tooltip>
        </Box>
      </form>
    </Box>
  );
}

export default createWallet;
