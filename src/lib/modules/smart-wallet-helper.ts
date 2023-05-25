import type { ContractCallOptions, STXTransferOptions } from '@stacks/connect';
import { openContractCall, openSTXTransfer } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
} from '@stacks/transactions';

import {
  CONNECT_AUTH_ORIGIN,
  EXPLORER_URL,
  SMART_WALLET_CONTRACT_ADDRESS,
  SMART_WALLET_CONTRACT_NAME,
} from './constants';

export function callSmartWalletContract(
  functionName: string,
  functionArgs: string[]
) {
  return {
    network: new StacksTestnet(),
    anchorMode: AnchorMode.Any,
    contractAddress: SMART_WALLET_CONTRACT_ADDRESS,
    contractName: SMART_WALLET_CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish: (data) => {
      console.log('onFinish:', data);
      if (!data?.txId) return;
      window
        .open(`${EXPLORER_URL}/txid/${data.txId}?chain=testnet`, '_blank')
        .focus();
    },
    onCancel: () => {
      console.log('onCancel:', 'Transaction was canceled');
    },
  };
}

export const handleSTXTransfer = async (
  options: STXTransferOptions
): Promise<void | null> => {
  return openSTXTransfer({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
};

export const handleContractCall = async (
  options: ContractCallOptions
): Promise<void | null> => {
  return openContractCall({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
};

export function pendingSigners() {
  // TODO
}
