import type BigNumber from 'bignumber.js';

import type { Money } from '../utils/format-money';

import type {
  BitcoinCryptoCurrencyAsset,
  StacksCryptoCurrencyAsset,
  StacksFungibleTokenAsset,
  StacksNonFungibleTokenAsset,
} from './crypto-asset.model';

export interface BitcoinCryptoCurrencyAssetBalance {
  readonly blockchain: 'bitcoin';
  readonly type: 'crypto-currency';
  readonly asset: BitcoinCryptoCurrencyAsset;
  readonly balance: Money;
}

export interface StacksCryptoCurrencyAssetBalance {
  readonly blockchain: 'stacks';
  readonly type: 'crypto-currency';
  readonly asset: StacksCryptoCurrencyAsset;
  readonly balance: Money;
}

export interface StacksFungibleTokenAssetBalance {
  readonly blockchain: 'stacks';
  readonly type: 'fungible-token';
  readonly asset: StacksFungibleTokenAsset;
  readonly balance: Money;
}

export interface StacksNonFungibleTokenAssetBalance {
  readonly blockchain: 'stacks';
  readonly type: 'non-fungible-token';
  readonly asset: StacksNonFungibleTokenAsset;
  readonly count: BigNumber;
}

export type AllCryptoCurrencyAssetBalances =
  | BitcoinCryptoCurrencyAssetBalance
  | StacksCryptoCurrencyAssetBalance;

export type AllTransferableCryptoAssetBalances =
  | AllCryptoCurrencyAssetBalances
  | StacksFungibleTokenAssetBalance;
