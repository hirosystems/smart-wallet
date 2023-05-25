import { Button, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { useContext, useState } from 'react';
import { useCurrentNetwork } from '../hooks/use-current-network';
import { API_URL, SMART_WALLET_CONTRACT_ADDRESS_2 } from '../modules/constants';
import { openTxLink } from '../utils/transactions-utils';
import HiroWalletContext from './HiroWalletContext';

export const DepositStx = () => {
  const network = useCurrentNetwork();
  const { testnetAddress, devnetAddress, mainnetAddress } =
    useContext(HiroWalletContext);
  //   console.log('DepositStxButton', {amount, testnetAddress, network: network.id, devnetAddress, mainnetAddress})

  const [inputAmount, setInputAmount] = useState('');
  const { doSTXTransfer } = useConnect();

  // TODO: get network being used
  const onClickHandler = async () => {
    doSTXTransfer({
      amount: (parseInt(inputAmount) * 1000000).toString(),
      recipient: SMART_WALLET_CONTRACT_ADDRESS_2,
      network: new StacksTestnet({ url: API_URL }), //network.id,
      onFinish: (data) => {
        const { txId } = data;
        console.log('doSTXTransfer onFinish', data);
        openTxLink(txId, network.id);
      },
      onCancel: () => {
        console.log('doSTXTransfer onCancel');
      },
      onError: (error) => {
        console.log('doSTXTransfer onError', error);
      },
    });
    // const txOptions = {
    //   recipient: SMART_WALLET_CONTRACT_ADDRESS_2,
    //   amount: parseInt(inputAmount) * 1000000, //BigInt(amount) * 1000000n,
    //   publicKey: devnetAddress || '',
    //   network: network.id, // for mainnet, use 'mainnet' // TODO: stackjs isnt supporting devnet
    //   //   memo: 'test stx transfer (deposit)',
    //   //   nonce: 0n, // set a nonce manually if you don't want builder to fetch from a Stacks node
    //   fee: 200, // 200n // set a tx fee if you don't want the builder to estimate
    //   anchorMode: AnchorMode.Any,
    // };

    // const transaction = await makeUnsignedSTXTokenTransfer(txOptions);

    // // to see the raw serialized tx
    // // const serializedTx = transaction.serialize(); // Uint8Array
    // // const serializedTxHex = bytesToHex(serializedTx); // hex string

    // // broadcasting transaction to the specified network
    // const broadcastResponse = await broadcastTransaction(transaction);
    // const txId = broadcastResponse.txid;
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
