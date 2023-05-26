import { StacksTestnet } from '@stacks/network';

export const SMART_WALLET_CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const SMART_WALLET_CONTRACT_NAME = 'wallet';
export const SMART_WALLET_CONTRACT_ADDRESS_2 = `${SMART_WALLET_CONTRACT_ADDRESS}.${SMART_WALLET_CONTRACT_NAME}`;
export const CONNECT_AUTH_ORIGIN = '/';

export const APP_URL = 'http://localhost:3000';
export const API_URL = 'http://localhost:3999';
export const EXPLORER_URL = 'http://localhost:8000';

export const DEVNET = new StacksTestnet({ url: API_URL });