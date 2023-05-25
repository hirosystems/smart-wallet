import { ChainID } from "@stacks/transactions";
import { NetworkConfiguration } from "./use-stx-balance";

export function useCurrentNetwork(): NetworkConfiguration {
    // return useSelector(selectCurrentNetwork);
    // return {
    //   name: 'mainnet',
    //   id: 'mainnet',
    //   chain: {
    //     bitcoin: {
    //       blockchain: 'bitcoin',
    //       url: 'https://stacks-node-api.mainnet.stacks.co',
    //       network: 'mainnet',
    //     },
    //     stacks: {
    //       blockchain: 'stacks',
    //       url: 'https://stacks-node-api.mainnet.stacks.co',
    //       chainId: ChainID.Mainnet,
    //     },
    //   },
    // };
    return {
      name: 'testnet',
      id: 'testnet',
      chain: {
        bitcoin: {
          blockchain: 'bitcoin',
          url: 'https://stacks-node-api.testnet.stacks.co',
          network: 'testnet',
        },
        stacks: {
          blockchain: 'stacks',
          url: 'https://stacks-node-api.testnet.stacks.co',
          chainId: ChainID.Testnet,
        },
      },
    };
  }