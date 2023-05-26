import { Button, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksNetwork, StacksTestnet } from '@stacks/network';
import { AnchorMode, FungibleConditionCode, PostConditionMode, makeStandardSTXPostCondition } from '@stacks/transactions';
import { useContext, useState } from 'react';
import { useCurrentNetwork } from '../hooks/use-current-network';
import { API_URL, SMART_WALLET_CONTRACT_ADDRESS_2 } from '../modules/constants';
import { openTxLink } from '../utils/transactions-utils';
import HiroWalletContext from './HiroWalletContext';

export const DepositStx = () => {
  const network = useCurrentNetwork();
  const [inputAmount, setInputAmount] = useState('');
  const { doSTXTransfer } = useConnect();
  const { currentAddress } = useContext(HiroWalletContext);
  // const { testnetAddress, devnetAddress, mainnetAddress } =
  //   useContext(HiroWalletContext);

  const onClickHandler = async () => {
    if (!currentAddress) return null;
    const amount = Math.floor(parseFloat(inputAmount) * 1_000_000);
    const pc = makeStandardSTXPostCondition(
      currentAddress,
      FungibleConditionCode.Equal,
      amount
    );
    doSTXTransfer({
      amount: amount.toString(),
      recipient: SMART_WALLET_CONTRACT_ADDRESS_2,
      network: new StacksTestnet({ url: API_URL }), // TODO: dont hardcode network
      memo: 'A memo',
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [pc],
      onFinish: (data) => {
        const { txId } = data;
        console.log('doSTXTransfer onFinish', data);
        openTxLink(txId, network.id);
        setInputAmount('');
      },
      onCancel: () => {
        console.log('doSTXTransfer onCancel');
      },
      onError: (error) => {
        console.log('doSTXTransfer onError', error);
      },
    });
  };

  return (
    <Stack border="1px solid white" padding="30px">
      <FormLabel>Amount</FormLabel>
      <Input
        type="text"
        size="lg"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
      />
      <Button onClick={onClickHandler}>Deposit STX</Button>
    </Stack>
  );
};
