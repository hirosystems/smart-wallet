import type { AddressTransactionsListResponse } from '@stacks/blockchain-api-client';
import { useQuery } from '@tanstack/react-query';
import { SMART_WALLET_CONTRACT_NAME } from '../utils/smart-wallet-utils';

import { useStacksClientUnanchored } from './use-stx-balance';

export const useSmartWallet = () => {
  const testAddress = 'ST1QA3YTTDH9QFNFPMKFYVHW17M5ZYKSB6NMPFSSJ';
  const stacksClient = useStacksClientUnanchored();

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-address-transactions', testAddress],
    queryFn: async () => {
      console.log({ stacksClient });
      const transactions =
        await stacksClient.accountsApi.getAccountTransactions({
          principal: testAddress,
        });
      console.log({ transactions });
      return checkTransactionsForSmartWalletDeploy(transactions);
    },
  });

  return { hasSmartWallet: data, isLoading, error };
};

const checkTransactionsForSmartWalletDeploy = (
  transactions: AddressTransactionsListResponse
): boolean => {
  console.log({ transactions });
  const smartWalletName = SMART_WALLET_CONTRACT_NAME;
  for (const tx of transactions.results as any[]) {
    // TODO: these need to be typed
    if (tx.tx_type === 'smart_contract') {
      const contractName = tx.smart_contract.contract_id;
      if (contractName.includes(smartWalletName)) {
        return true;
      }
    }
  }

  return false;
};
