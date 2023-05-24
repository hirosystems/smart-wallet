import { isWebUri } from 'valid-url';

import { isUndefined } from '../hooks/use-stx-balance';
import type { StacksFungibleTokenAsset } from '../models/crypto-asset.model';

import { abbreviateNumber } from './number-utils';

function removeCommas(amountWithCommas: string) {
  return amountWithCommas.replace(/,/g, '');
}

export function getFormattedBalance(amount: string) {
  const noCommas = removeCommas(amount);
  const number = noCommas.includes('.')
    ? parseFloat(noCommas)
    : parseInt(noCommas);
  return number > 10000
    ? {
        isAbbreviated: true,
        value: abbreviateNumber(number),
      }
    : { value: amount, isAbbreviated: false };
}

export function formatContractId(address: string, name: string) {
  return `${address}.${name}`;
}

export function convertUnicodeToAscii(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function isFtNameLikeStx(name: string) {
  return ['stx', 'stack', 'stacks'].includes(
    convertUnicodeToAscii(name).toLocaleLowerCase()
  );
}

export function getImageCanonicalUri(imageCanonicalUri: string, name: string) {
  return imageCanonicalUri &&
    isValidUrl(imageCanonicalUri) &&
    !isFtNameLikeStx(name)
    ? imageCanonicalUri
    : '';
}

export function isValidUrl(str: string) {
  return !!isWebUri(str);
}

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

function kebabCase(str: string) {
  return str.replace(KEBAB_REGEX, (match) => `-${match.toLowerCase()}`);
}

function getLetters(string: string, offset = 1) {
  return string.slice(0, offset);
}

export function getTicker(value: string) {
  let name = kebabCase(value);
  if (name.includes('-')) {
    const words = name.split('-');
    if (words.length >= 3) {
      name = `${getLetters(words[0])}${getLetters(words[1])}${getLetters(
        words[2]
      )}`;
    } else {
      name = `${getLetters(words[0])}${getLetters(words[1], 2)}`;
    }
  } else if (name.length >= 3) {
    name = `${getLetters(name, 3)}`;
  }
  return name.toUpperCase();
}

export function isTransferableStacksFungibleTokenAsset(
  asset: StacksFungibleTokenAsset
) {
  return (
    !isUndefined(asset.decimals) &&
    !isUndefined(asset.name) &&
    !isUndefined(asset.symbol)
  );
}
