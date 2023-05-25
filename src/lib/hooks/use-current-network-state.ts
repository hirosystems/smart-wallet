import { ChainID } from '@stacks/transactions';
import { useMemo } from 'react';
import { useCurrentNetwork } from './use-current-network';

export enum DefaultNetworkModes {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export type NetworkModes = keyof typeof DefaultNetworkModes;

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
