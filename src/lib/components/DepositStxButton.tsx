import { makeSTXTokenTransfer, broadcastTransaction, AnchorMode } from '@stacks/transactions';



export const DepositStxButton = () => {

    const onTransferClick = () => {
        const txOptions = {
            recipient: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
            amount: 12345n,
            senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
            network: 'testnet', // for mainnet, use 'mainnet'
            memo: 'test memo',
            nonce: 0n, // set a nonce manually if you don't want builder to fetch from a Stacks node
            fee: 200n, // set a tx fee if you don't want the builder to estimate
            anchorMode: AnchorMode.Any,
          };
          
          const transaction = await makeSTXTokenTransfer(txOptions);
          
          // to see the raw serialized tx
          const serializedTx = transaction.serialize(); // Uint8Array
          const serializedTxHex = bytesToHex(serializedTx); // hex string
          
          // broadcasting transaction to the specified network
          const broadcastResponse = await broadcastTransaction(transaction);
          const txId = broadcastResponse.txid;
      };


}