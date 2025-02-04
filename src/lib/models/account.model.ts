import type { AccountBalanceStxKeys } from '../hooks/use-stx-balance';
import type { Money } from '../utils/format-money';

/**
 * This is a duplicated type from the types lib/generated API client
 * We define it client side, as the library-returned types are not accurate
 */
export interface AddressBalanceResponse {
  stx: {
    balance: string;
    total_sent: string;
    total_received: string;
    total_fees_sent: string;
    total_miner_rewards_received: string;
    lock_tx_id: string;
    locked: string;
    lock_height: number;
    burnchain_lock_height: number;
    burnchain_unlock_height: number;
  };
  fungible_tokens: Record<
    string,
    {
      balance: string;
      total_sent: string;
      total_received: string;
    }
  >;
  non_fungible_tokens: Record<
    string,
    {
      count: string;
      total_sent: string;
      total_received: string;
    }
  >;
  token_offering_locked?: AddressTokenOfferingLocked;
}
export interface AccountBalanceResponseBigNumber
  extends Omit<AddressBalanceResponse, 'stx'> {
  stx: AccountStxBalanceBigNumber;
}

export interface AccountStxBalanceBigNumber
  extends Omit<AddressBalanceResponse['stx'], AccountBalanceStxKeys> {
  balance: Money;
  total_sent: Money;
  total_received: Money;
  total_fees_sent: Money;
  total_miner_rewards_received: Money;
  locked: Money;
}
