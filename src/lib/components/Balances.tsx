import { Box } from '@chakra-ui/react';
import { useStxAssetBalance } from '../hooks/use-stx-balance';

export const Balances = () => {
  const stxAddress = 'SP3TWZ3ARWBTMTWRNTZPK31HN163P1X6YQ1C249YY';
  const { stxAssetBalance } = useStxAssetBalance(stxAddress);
  console.log({ stxAssetBalance });

  return (
    <Box>
      <h3>Balances</h3>
      <Box>{`STX: ${stxAssetBalance}`}</Box>
    </Box>
  );
};
