import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import { useStxAssetBalance } from '../hooks/use-stx-balance';
import { useStacksFungibleTokenAssetBalancesAnchoredWithMetadata } from '../query/balance';
import HiroWalletContext from './HiroWalletContext';
import { StacksFungibleTokenAssetList } from './StacksFungibleTokensAssetList';
import StxBalance from './StxBalance';

export const Balances = () => {
  const { mainnetAddress, testnetAddress } = useContext(HiroWalletContext);
  console.log({ mainnetAddress });
  const address = testnetAddress;
  if (!address) return null;
  const { stxAssetBalance } = useStxAssetBalance(address);
  const stacksFtAssetBalances =
    useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(address);

  console.log({ stxAssetBalance });

  return (
    <Box>
      <h3>Balances</h3>
      <StxBalance stxAssetBalance={stxAssetBalance} />
      <StacksFungibleTokenAssetList assetBalances={stacksFtAssetBalances} />
    </Box>
  );
};
