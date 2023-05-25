import { ChainID } from '@stacks/transactions';
import { useMemo } from 'react';
import { DefaultNetworkModes, useCurrentNetwork } from './use-current-network';

export function useCurrentNetworkState() {
  const currentNetwork = useCurrentNetwork(); // TODO: hardcode mainnet for now. Try using react redux to test it out

  return useMemo(() => {
    const isTestnet = currentNetwork.chain.stacks.chainId === ChainID.Testnet;
    const mode = isTestnet
      ? DefaultNetworkModes.testnet
      : DefaultNetworkModes.mainnet;
    return { ...currentNetwork, isTestnet, mode };
  }, [currentNetwork]);
}
