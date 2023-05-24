import type { FungibleTokenMetadata } from '@stacks/blockchain-api-client';
import { getAssetStringParts } from '@stacks/ui-utils';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import type { RateLimiter } from 'limiter';
import { useMemo } from 'react';

import {
  createMoney,
  useAnchoredStacksAccountBalanceQuery,
  useCurrentNetworkState,
  useHiroApiRateLimiter,
  useStacksClientUnanchored,
} from '../hooks/use-stx-balance';
import type { AccountBalanceResponseBigNumber } from '../models/account.model';
import type { StacksFungibleTokenAssetBalance } from '../models/crypto-asset-balance.model';
import type { StacksClient } from '../modules/stacks-client';
import {
  formatContractId,
  isTransferableStacksFungibleTokenAsset,
} from '../utils/stacks-crypto-asset.utils';

function createStacksFtCryptoAssetBalanceTypeWrapper(
  balance: BigNumber,
  contractId: string
): StacksFungibleTokenAssetBalance {
  const { address, contractName, assetName } = getAssetStringParts(contractId);
  return {
    blockchain: 'stacks',
    type: 'fungible-token',
    balance: createMoney(balance, '', 0),
    asset: {
      contractId,
      canTransfer: false,
      contractAddress: address,
      contractAssetName: assetName,
      contractName,
      decimals: 0,
      hasMemo: false,
      imageCanonicalUri: '',
      name: '',
      symbol: '',
    },
  };
}
export function convertFtBalancesToStacksFungibleTokenAssetBalanceType(
  ftBalances: AccountBalanceResponseBigNumber['fungible_tokens']
) {
  return (
    Object.entries(ftBalances)
      .map(([key, value]) => {
        const balance = new BigNumber(value.balance);
        return createStacksFtCryptoAssetBalanceTypeWrapper(balance, key);
      })
      // Assets users have traded will persist in the api response
      .filter((assetBalance) => !assetBalance?.balance.amount.isEqualTo(0))
  );
}
function useStacksFungibleTokenAssetBalancesAnchored(address: string) {
  return useAnchoredStacksAccountBalanceQuery(address, {
    select: (resp) =>
      convertFtBalancesToStacksFungibleTokenAssetBalanceType(
        resp.fungible_tokens
      ),
  });
}

export function useStacksFungibleTokenAssetBalancesAnchoredWithMetadata(
  address: string
) {
  const { data: initializedAssetBalances = [] } =
    useStacksFungibleTokenAssetBalancesAnchored(address);

  const ftAssetsMetadata = useGetFungibleTokenMetadataListQuery(
    initializedAssetBalances.map((assetBalance) =>
      formatContractId(
        assetBalance.asset.contractAddress,
        assetBalance.asset.contractName
      )
    )
  );
  return useMemo(
    () =>
      initializedAssetBalances.map((assetBalance, i) => {
        const metadata = ftAssetsMetadata[i].data;
        if (!metadata) return assetBalance;
        return addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
          assetBalance,
          metadata
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initializedAssetBalances]
  );
}

const staleTime = 12 * 60 * 60 * 1000;

const queryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retry: 0,
} as const;

export function useGetFungibleTokenMetadataListQuery(
  contractIds: string[]
): UseQueryResult<FungibleTokenMetadata>[] {
  const client = useStacksClientUnanchored();
  const network = useCurrentNetworkState();
  const limiter = useHiroApiRateLimiter();
  return useQueries({
    queries: contractIds.map((contractId) => ({
      queryKey: ['get-ft-metadata', contractId, network.chain.stacks.url],
      queryFn: fetchUnanchoredAccountInfo(client, limiter)(contractId),
      ...queryOptions,
    })),
  });
}

export function addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
  assetBalance: StacksFungibleTokenAssetBalance,
  metadata: FungibleTokenMetadata
) {
  return {
    ...assetBalance,
    balance: createMoney(
      assetBalance.balance.amount,
      metadata.symbol ?? '',
      metadata.decimals ?? 0
    ),
    asset: {
      ...assetBalance.asset,
      canTransfer: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      decimals: metadata.decimals,
      hasMemo: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      imageCanonicalUri: metadata.image_canonical_uri,
      name: metadata.name,
      symbol: metadata.symbol,
    },
  };
}

function fetchUnanchoredAccountInfo(
  client: StacksClient,
  limiter: RateLimiter
) {
  return (contractId: string) => async () => {
    await limiter.removeTokens(1);
    return client.fungibleTokensApi.getContractFtMetadata({ contractId });
  };
}
