// import { BoxProps } from '@stacks/ui';
// import { forwardRefWithAs } from '@stacks/ui-core';
// import { getAssetName } from '@stacks/ui-utils';
// import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import type { BoxProps } from '@chakra-ui/react';
import { useRef } from 'react';

import type { StacksFungibleTokenAssetBalance } from '../models/crypto-asset-balance.model';
import type { Money } from '../utils/format-money';
import {
  formatContractId,
  getImageCanonicalUri,
} from '../utils/stacks-crypto-asset.utils';

import { StacksFungibleTokenAssetItemLayout } from './fungible-tokens/stacks-fungible-token-asset-item.layout';

// import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';
// import { Money } from '@shared/models/money.model';

// import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
// import { formatContractId, getTicker } from '@app/common/utils';

// import { StacksFungibleTokenAssetItemLayout } from './stacks-fungible-token-asset-item.layout';

interface StacksFungibleTokenAssetItemProps extends BoxProps {
  assetBalance: StacksFungibleTokenAssetBalance;
  unanchoredAssetBalance?: Money;
  isPressable?: boolean;
}

export const StacksFungibleTokenAssetItem = (
  props: StacksFungibleTokenAssetItemProps
) => {
  const ref = useRef(null);
  const { assetBalance, unanchoredAssetBalance, ...rest } = props;
  const { asset, balance } = assetBalance;
  const { contractAddress, contractAssetName, contractName, name, symbol } =
    asset;

  const avatar = `${formatContractId(
    contractAddress,
    contractName
  )}::${contractAssetName}`;

  //   const friendlyName =
  //     name ||
  //     (contractAssetName.includes('::')
  //       ? getAssetName(contractAssetName)
  //       : contractAssetName);
  const imageCanonicalUri = getImageCanonicalUri(
    asset.imageCanonicalUri,
    asset.name
  );
  const caption = symbol; // || getTicker(friendlyName);

  return (
    <StacksFungibleTokenAssetItemLayout
      avatar={avatar}
      balance={balance}
      caption={caption}
      imageCanonicalUri={imageCanonicalUri}
      //   ref={ref}
      subBalance={unanchoredAssetBalance}
      title={name || contractAssetName}
      {...rest}
    />
  );
};
