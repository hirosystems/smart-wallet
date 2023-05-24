import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { getFormattedBalance } from '../utils/stacks-crypto-asset.utils';
import { ftDecimals } from '../utils/fungible-tokens-utils';

const StxBalance = ({ stxAssetBalance }) => {
  if (!stxAssetBalance) return null;
  const balance = stxAssetBalance.balance;
  console.log('balance', balance);
  console.log(balance.amount.toString());
  const formattedBalance = getFormattedBalance(ftDecimals(balance.amount, balance.decimals));
  console.log('formattedBalance', formattedBalance)

  return (
    <Box>
      <Text fontWeight="bold">{`STX: ${formattedBalance.value}`} {balance.symbol}</Text>
    </Box>
  );
};

export default StxBalance;
