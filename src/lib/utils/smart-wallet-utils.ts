import { ClarityValue, serializeCV } from "@stacks/transactions";

export const SMART_WALLET_CONTRACT_NAME = 'smart-wallet-v001';

export const cvToHex = (cv: ClarityValue) => {
  const serialized = serializeCV(cv);
  return `0x${serialized.toString('hex')}`;
};
