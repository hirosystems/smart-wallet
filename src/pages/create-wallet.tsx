import {
  Box,
  Button,
  FormLabel,
  Input,
  Stack,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { AnchorMode } from '@stacks/transactions';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import HiroWalletContext from '~/lib/components/HiroWalletContext';
import { smartWalletContract } from '~/lib/contracts/wallet-contract';
import { useCurrentNetwork } from '~/lib/hooks/use-current-network';
import { DEVNET, SMART_WALLET_CONTRACT_NAME } from '~/lib/modules/constants';
import { openTxLink } from '~/lib/utils/transactions-utils';

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

function createWallet() {
  const { currentAddress } = useContext(HiroWalletContext);
  const router = useRouter();
  const { doContractDeploy } = useConnect();
  const network = useCurrentNetwork();
  const toast = useToast();

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    control,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      // await saveWalletOwnerMutation({ ...data, userAddress: testnetAddress });
      toast({
        title: "",
        description: `User info saved successfully`,
        status: "success",
      });
    } catch (error) {
      console.error('Error during form submission: ', error);
    }
  };

  const deployWalletOnClickHandler = useCallback(() => {
    const deployWalletAsync = async () => {
      doContractDeploy({
        contractName: smartWalletContract.name,
        codeBody: smartWalletContract.source,
        network: DEVNET,
        anchorMode: AnchorMode.Any,
        onFinish: (data) => {
          const { txId } = data;
          openTxLink(txId, network.id);
          toast({
            title: "",
            description: `Wallet deployed successfully`,
            status: "success",
          });
          router.push('/add-signer');
        },
        onCancel: () => {
          toast({
            title: "",
            description: `Wallet deployment cancelled`,
            status: "error",
          });
          console.log('doSTXTransfer onCancel');
        },
        onError: (error) => {
          toast({
            title: "",
            description: `Error deploying wallet`,
            status: "error",
          });
          console.log('doSTXTransfer onError', error);
        },
      });
    };
    deployWalletAsync();
  }, [router]);

  return (
    <Box>
      <Box> This info will be used to notify about your wallet activity </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
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
        </Stack>

        <Stack>
          <Button type="submit">Submit</Button>

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
                onClick={deployWalletOnClickHandler}
              >
                Deploy Smart Wallet
              </Button>
            </Tooltip>
        </Stack>
      </form>
    </Box>
  );
}

export default createWallet;
