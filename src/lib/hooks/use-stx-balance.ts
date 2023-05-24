import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { ChainID } from '@stacks/transactions';
import { UseQueryOptions } from '@tanstack/react-query';
import { RateLimiter } from 'limiter';
import { fetcher as fetchApi } from '../utils/wrapped-fetch';

// import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
// import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import {
  AddressTokenOfferingLocked,
  Configuration,
  Middleware,
  RequestContext,
} from '@stacks/blockchain-api-client';
import BigNumber from 'bignumber.js';
import { StacksClient } from '../modules/stacks-client';
import { Money } from '../utils/format-money';
// import { i18nFormatCurrency } from '../utils/format-money';

export function useStxAssetBalance(address: string) {
  //   const stxMarketData = useCryptoCurrencyMarketData('STX');
  const { data: balance, isLoading } =
    useStacksAnchoredCryptoCurrencyAssetBalance(address);

  return useMemo(
    () => ({
      isLoading,
      stxAssetBalance: balance,
      //   stxUsdBalance: balance
      //     ? i18nFormatCurrency(
      //         baseCurrencyAmountInQuote(balance.balance, stxMarketData)
      //       )
      //     : undefined,
    }),
    [balance, isLoading]
  );
}

export function useStacksAnchoredCryptoCurrencyAssetBalance(address: string) {
  return useAnchoredStacksAccountBalanceQuery(address, {
    select: (resp) =>
      createStacksCryptoCurrencyAssetTypeWrapper(
        parseBalanceResponse(resp).stx.availableStx.amount
      ),
  });
}

export function createStacksCryptoCurrencyAssetTypeWrapper(
  balance: BigNumber
): StacksCryptoCurrencyAssetBalance {
  return {
    blockchain: 'stacks',
    type: 'crypto-currency',
    balance: createMoney(balance, 'STX'),
    asset: {
      decimals: STX_DECIMALS,
      hasMemo: true,
      name: 'Stacks',
      symbol: 'STX',
    },
  };
}

export interface StacksCryptoCurrencyAssetBalance {
  readonly blockchain: 'stacks';
  readonly type: 'crypto-currency';
  readonly asset: StacksCryptoCurrencyAsset;
  readonly balance: Money;
}
export interface StacksCryptoCurrencyAsset {
  decimals: number;
  hasMemo: boolean;
  name: string;
  symbol: 'STX';
}

type AllowedReactQueryConfigOptions = keyof Pick<
  UseQueryOptions,
  'select' | 'initialData' | 'onSuccess' | 'onSettled' | 'onError' | 'suspense'
>;

export type AppUseQueryConfig<QueryFnData, Response> = Pick<
  UseQueryOptions<QueryFnData, unknown, Response>,
  AllowedReactQueryConfigOptions
>;

function fetchAccountBalance(client: StacksClient, limiter: RateLimiter) {
  return async (principal: string) => {
    await limiter.removeTokens(1);
    // Coercing type with client-side one that's more accurate
    return client.accountsApi.getAccountBalance({
      principal,
    }) as Promise<AddressBalanceResponse>;
  };
}

export interface AddressBalanceResponse {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
    total_fees_sent: string;
    total_miner_rewards_received: string;
    lock_tx_id: string;
    locked: string;
    lock_height: number;
    burnchain_lock_height: number;
    burnchain_unlock_height: number;
  };
  fungible_tokens: Record<
    string,
    {
      balance: string;
      total_sent: string;
      total_received: string;
    }
  >;
  non_fungible_tokens: Record<
    string,
    {
      count: string;
      total_sent: string;
      total_received: string;
    }
  >;
  token_offering_locked?: AddressTokenOfferingLocked;
}

type FetchAccountBalanceResp = Awaited<
  ReturnType<ReturnType<typeof fetchAccountBalance>>
>;

export function useAnchoredStacksAccountBalanceQuery<
  T extends unknown = FetchAccountBalanceResp
>(address: string, options?: AppUseQueryConfig<FetchAccountBalanceResp, T>) {
  const client = useStacksClientUnanchored();
  const limiter = useHiroApiRateLimiter();

  return useQuery({
    enabled: !!address,
    queryKey: ['get-address-anchored-stx-balance', address],
    queryFn: () => fetchAccountBalance(client, limiter)(address),
    ...balanceQueryOptions,
    ...options,
  });
}

// Unanchored by default (microblocks)
export function useStacksClientUnanchored() {
  const network = useCurrentNetworkState();

  return useMemo(() => {
    const config = createStacksUnanchoredConfig(network.chain.stacks.url);
    return new StacksClient(config);
  }, [network.chain.stacks.url]);
}

export function useHiroApiRateLimiter() {
  const network = useCurrentNetworkState();

  return whenStxChainId(network.chain.stacks.chainId)({
    [ChainID.Mainnet]: hiroStacksMainnetApiLimiter,
    [ChainID.Testnet]: hiroStacksTestnetApiLimiter,
  });
}

const hiroStacksMainnetApiLimiter = new RateLimiter({
  tokensPerInterval: 500,
  interval: 'minute',
});

const hiroStacksTestnetApiLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'minute',
});

interface WhenChainIdMap<T> {
  [ChainID.Mainnet]: T;
  [ChainID.Testnet]: T;
}
export function whenStxChainId(chainId: ChainID) {
  return <T>(chainIdMap: WhenChainIdMap<T>): T => chainIdMap[chainId];
}

const staleTime = 1 * 60 * 1000;
const balanceQueryOptions = {
  staleTime,
  keepPreviousData: false,
  refetchOnMount: true,
} as const;

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

export function useCurrentNetwork(): NetworkConfiguration {
  // return useSelector(selectCurrentNetwork);
  return {
    name: 'mainnet',
    id: 'mainnet',
    chain: {
      bitcoin: {
        blockchain: 'bitcoin',
        url: 'https://stacks-node-api.mainnet.stacks.co',
        network: 'mainnet',
      },
      stacks: {
        blockchain: 'stacks',
        url: 'https://stacks-node-api.mainnet.stacks.co',
        chainId: ChainID.Mainnet,
      },
    },
  };
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

export enum DefaultNetworkModes {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export type NetworkModes = keyof typeof DefaultNetworkModes;

// export const MICROBLOCKS_ENABLED = !IS_TEST_ENV && true;
export const MICROBLOCKS_ENABLED = true;

const unanchoredStacksMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    if (!url.toString().includes('/v2'))
      url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

export function createStacksUnanchoredConfig(basePath: string) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredStacksMiddleware);
  return new Configuration({
    basePath,
    fetchApi,
    middleware,
  });
}

// const hiroHeaders: HeadersInit = {
//   'x-hiro-product': 'stacks-wallet-web',
//   'x-hiro-version': VERSION,
// };

export const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];

type SelectedKeys =
  | 'balance'
  | 'total_sent'
  | 'total_received'
  | 'total_fees_sent'
  | 'total_miner_rewards_received'
  | 'locked';

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export type CryptoCurrencies = 'BTC' | 'STX';

export type FiatCurrencies = 'USD';

export type Currencies = CryptoCurrencies | FiatCurrencies | string;

export const BTC_DECIMALS = 8;
export const STX_DECIMALS = 6;

export const currencydecimalsMap: Record<Currencies, number> = {
  BTC: BTC_DECIMALS,
  STX: STX_DECIMALS,
  USD: 2,
};

function throwWhenDecimalUnknown(symbol: Currencies, decimals?: number) {
  if (isUndefined(decimals) && isUndefined(currencydecimalsMap[symbol]))
    throw new Error(
      `Resolution of currency ${symbol} is unknown, must be described`
    );
}

/**
 * @param value Amount described in currency's fractional base unit, e.g. cents for USD amounts
 * @param symbol Identifying letter code, e.g. EUR
 * @param resolution Optional, required if value not known at build-time
 */
export function createMoney(
  value: NumType,
  symbol: Currencies,
  resolution?: number
): Money {
  throwWhenDecimalUnknown(symbol, resolution);
  const decimals = currencydecimalsMap[symbol] ?? resolution;
  const amount = new BigNumber(value);
  return Object.freeze({ amount, symbol, decimals });
}

export type AccountBalanceStxKeys = keyof Pick<
  AddressBalanceResponse['stx'],
  SelectedKeys
>;

export type NumType = BigNumber | number;

export interface AccountStxBalanceBigNumber
  extends Omit<AddressBalanceResponse['stx'], AccountBalanceStxKeys> {
  balance: Money;
  total_sent: Money;
  total_received: Money;
  total_fees_sent: Money;
  total_miner_rewards_received: Money;
  locked: Money;
}

export function parseBalanceResponse(balances: AddressBalanceResponse) {
  const stxMoney = Object.fromEntries(
    accountBalanceStxKeys.map((key) => [
      key,
      { amount: new BigNumber(balances.stx[key]), symbol: 'STX' },
    ])
  ) as Record<AccountBalanceStxKeys, Money>;

  const stx: AccountStxBalanceBigNumber & { availableStx: Money } = {
    ...balances.stx,
    ...stxMoney,
    availableStx: createMoney(
      stxMoney.balance.amount.minus(stxMoney.locked.amount),
      'STX'
    ),
  };
  return { ...balances, stx };
}






