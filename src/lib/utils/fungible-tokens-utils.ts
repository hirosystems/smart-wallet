import BigNumber from 'bignumber.js';
import { initBigNumber } from './number-utils';

export const ftDecimals = (
  value: number | string | BigNumber,
  decimals: number
) => {
  const amount = initBigNumber(value);
  return amount
    .shiftedBy(-decimals)
    .toNumber()
    .toLocaleString('en-US', { maximumFractionDigits: decimals });
};
