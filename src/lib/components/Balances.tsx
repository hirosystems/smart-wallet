import { Box, Stack } from '@chakra-ui/react';
import { useContext } from 'react';
import { useHardcodedSmartWallet } from '../hooks/use-smart-wallet';

import { useStxAssetBalance } from '../hooks/use-stx-balance';
import { SMART_WALLET_CONTRACT_ADDRESS_2 } from '../modules/constants';
import { useStacksFungibleTokenAssetBalancesAnchoredWithMetadata } from '../query/balance';

import HiroWalletContext from './HiroWalletContext';
import { StacksFungibleTokenAssetList } from './StacksFungibleTokensAssetList';
import StxBalance from './StxBalance';

export const Balances = () => {
  const { currentAddress } = useContext(HiroWalletContext);
  const {
    hasSmartWallet,
    isLoading: isSmartWalletLoading,
    error,
  } = useHardcodedSmartWallet();
  if (!currentAddress) return null;
  const { stxAssetBalance: hiroWalletStxAssetBalance } =
    useStxAssetBalance(currentAddress);
  const hiroWalletStacksFtAssetBalances =
    useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(currentAddress);

  const { stxAssetBalance: smartWalletStxAssetBalance } = useStxAssetBalance(
    SMART_WALLET_CONTRACT_ADDRESS_2
  );
  const smartWalletStacksFtAssetBalances =
    useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(
      SMART_WALLET_CONTRACT_ADDRESS_2
    );

  return (
    <Stack border="1px solid white" padding="30px">
      <h3>Hiro Wallet Balances</h3>
      <StxBalance stxAssetBalance={hiroWalletStxAssetBalance} />
      <StacksFungibleTokenAssetList
        assetBalances={hiroWalletStacksFtAssetBalances}
      />
      <h3>Smart Wallet Balances</h3>
      {hasSmartWallet ? (
        <>
          <StxBalance stxAssetBalance={smartWalletStxAssetBalance} />
          <StacksFungibleTokenAssetList
            assetBalances={smartWalletStacksFtAssetBalances}
          />
        </>
      ) : (
        <Box>No Smart Wallet Deployed</Box>
      )}
    </Stack>
  );
};
