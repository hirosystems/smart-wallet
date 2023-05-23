import { StacksTestnet } from "@stacks/network";
import { AnchorMode, PostConditionMode, stringUtf8CV } from "@stacks/transactions";
import { CONNECT_AUTH_ORIGIN, SMART_WALLET_CONTRACT_ADDRESS, SMART_WALLET_CONTRACT_NAME } from "./constants";
import {
  ContractCallOptions,
  STXTransferOptions,
  openContractCall,
  openSTXTransfer,
} from "@stacks/connect";

export function callSmartWalletContract(functionName: string, functionArgs: string[]) {
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
      console.log("onFinish:", data);
      if (!data?.txId) return;
      window
        .open(
          `https://explorer.hiro.so/txid/${data.txId}?chain=testnet`,
          "_blank"
        )
        .focus();
    },
    onCancel: () => {
      console.log("onCancel:", "Transaction was canceled");
    },
  }
}

export const handleSTXTransfer = async (
  options: STXTransferOptions
): Promise<void | null> => {
  const payload = await openSTXTransfer({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
  return payload;
};

export const handleContractCall = async (
  options: ContractCallOptions
): Promise<void | null> => {
  const payload = await openContractCall({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
  return payload;
};

export function pendingSigners() {
  // TODO
}
