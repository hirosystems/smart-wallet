import type { AddressTransactionsListResponse } from '@stacks/blockchain-api-client';
import { useQuery } from '@tanstack/react-query';
import { SMART_WALLET_CONTRACT_NAME } from '../utils/smart-wallet-utils';

import { useStacksClientUnanchored } from './use-stx-balance';
import { useContext } from 'react';
import HiroWalletContext from '../components/HiroWalletContext';

export const useSmartWallet = () => {
  // const testnetAddress = 'ST1QA3YTTDH9QFNFPMKFYVHW17M5ZYKSB6NMPFSSJ';
  const { testnetAddress } = useContext(HiroWalletContext);
  const stacksClient = useStacksClientUnanchored();

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-address-transactions', testnetAddress],
    queryFn: async () => {
      console.log({ stacksClient });
      const transactions =
        await stacksClient.accountsApi.getAccountTransactions({
          principal: testnetAddress,
        });
      console.log({ transactions });
      return checkTransactionsForSmartWalletDeploy(transactions);
    },
  }, { enabled: !!testnetAddress });

  if (!testnetAddress) {
    console.error('No testnet address found');
    return { hasSmartWallet: false, isLoading: false, error: null };
  }

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
