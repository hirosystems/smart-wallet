import BigNumber from 'bignumber.js';

const thinSpace = ' ';

export function i18nFormatCurrency(quantity: Money, locale = 'en-US') {
  if (quantity.symbol !== 'USD')
    throw new Error('Cannot format non-USD amounts');
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  });

  const formatted = currencyFormatter.format(
    quantity.amount.shiftedBy(-quantity.decimals).toNumber()
  );

  if (quantity.amount.isGreaterThan(0) && formatted === '$0.00')
    return `< ${formatted.replace('0.00', '0.01')}`;

  return formatted;
}

export interface Money {
  readonly amount: BigNumber;
  readonly symbol: Currencies;
  readonly decimals: number;
}

export type NumType = BigNumber | number;

export type CryptoCurrencies = 'BTC' | 'STX';

export type FiatCurrencies = 'USD';

export type Currencies = CryptoCurrencies | FiatCurrencies | string;
