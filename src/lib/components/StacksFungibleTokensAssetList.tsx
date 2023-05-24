import { Stack } from '@chakra-ui/react';
import { StacksFungibleTokenAssetBalance } from '../models/crypto-asset-balance.model';
import { StacksFungibleTokenAssetItem } from './StacksFungibleTokenAssetItem';

interface StacksFtCryptoAssetsProps {
  assetBalances: StacksFungibleTokenAssetBalance[];
}

export const StacksFungibleTokenAssetList = ({
  assetBalances,
}: StacksFtCryptoAssetsProps) => (
  <Stack>
    {assetBalances.map((assetBalance) => (
      <StacksFungibleTokenAssetItem
        assetBalance={assetBalance}
        key={assetBalance.asset.name}
      />
    ))}
  </Stack>
);
