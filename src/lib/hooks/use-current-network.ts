import { ChainID } from '@stacks/transactions';

export const DEFAULT_SERVER_MAINNET = 'https://stacks-node-api.stacks.co';
export const DEFAULT_SERVER_TESTNET =
  'https://stacks-node-api.testnet.stacks.co';

export const BITCOIN_API_BASE_URL_MAINNET = 'https://blockstream.info/api';
export const BITCOIN_API_BASE_URL_TESTNET =
  'https://blockstream.info/testnet/api';

export enum DefaultNetworkModes {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export type NetworkModes = keyof typeof DefaultNetworkModes;
interface BitcoinChainConfig extends BaseChainConfig {
  blockchain: 'bitcoin';
  url: string;
  network: NetworkModes;
}

interface StacksChainConfig extends BaseChainConfig {
  blockchain: 'stacks';
  url: string;
  chainId: ChainID;
}

export enum DefaultNetworkConfigurationIds {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}
export interface NetworkConfiguration {
  name: string;
  id: DefaultNetworkConfigurations;
  chain: {
    bitcoin: BitcoinChainConfig;
    stacks: StacksChainConfig;
  };
}

export type DefaultNetworkConfigurations =
  keyof typeof DefaultNetworkConfigurationIds;

interface BaseChainConfig {
  blockchain: Blockchains;
}
export type Blockchains = 'bitcoin' | 'stacks';

const networkMainnet: NetworkConfiguration = {
  id: DefaultNetworkConfigurationIds.mainnet,
  name: 'Mainnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Mainnet,
      url: DEFAULT_SERVER_MAINNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'mainnet',
      url: BITCOIN_API_BASE_URL_MAINNET,
    },
  },
};

const networkTestnet: NetworkConfiguration = {
  id: DefaultNetworkConfigurationIds.testnet,
  name: 'Testnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: DEFAULT_SERVER_TESTNET,
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'testnet',
      url: BITCOIN_API_BASE_URL_TESTNET,
    },
  },
};

const networkDevnet: NetworkConfiguration = {
  id: DefaultNetworkConfigurationIds.devnet,
  name: 'Devnet',
  chain: {
    stacks: {
      blockchain: 'stacks',
      chainId: ChainID.Testnet,
      url: 'http://localhost:3999',
    },
    bitcoin: {
      blockchain: 'bitcoin',
      network: 'testnet',
      url: BITCOIN_API_BASE_URL_TESTNET,
    },
  },
};

export function useCurrentNetwork(): NetworkConfiguration {
  //   return networkMainnet;
  // return networkTestnet;
    return networkDevnet; // TODO: don't hardcode network
}
