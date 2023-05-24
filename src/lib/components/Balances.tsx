import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { useStxAssetBalance } from '../hooks/use-stx-balance';
import { useStacksFungibleTokenAssetBalancesAnchoredWithMetadata } from '../query/balance';
import HiroWalletContext from './HiroWalletContext';
import { StacksFungibleTokenAssetList } from './StacksFungibleTokensAssetList';

export const Balances = () => {
  const { mainnetAddress } = useContext(HiroWalletContext);
  console.log({ mainnetAddress });
  const address = mainnetAddress || '';
  const stxAddress = 'SP3TWZ3ARWBTMTWRNTZPK31HN163P1X6YQ1C249YY'; // TODO: get from the connected wallet and its smart contract wallet
  const { stxAssetBalance } = useStxAssetBalance(address);
  const stacksFtAssetBalances =
    useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address);

  console.log({ stxAssetBalance });

  return (
    <Box>
      <h3>Balances</h3>
      <Box>{`STX: ${stxAssetBalance}`}</Box>
      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
    </Box>
  );
};
