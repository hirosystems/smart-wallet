import { FiCornerDownRight } from 'react-icons/fi';
import { Box, Text} from '@chakra-ui/react';
import { ftDecimals } from '../utils/fungible-tokens-utils';
import { Money } from '../utils/format-money';

interface SubBalanceProps {
  balance: Money;
}
export function SubBalance({ balance }: SubBalanceProps) {
  return (
    <Text
      // color={color('text-caption')}
      // fontVariantNumeric="tabular-nums"
      textAlign="right"
      fontSize="12px"
    >
      <Box
        as={FiCornerDownRight}
        strokeWidth={2}
        style={{ display: 'inline-block', paddingRight: '2px' }}
      />
      {ftDecimals(balance.amount, balance.decimals)}
    </Text>
  );
}
