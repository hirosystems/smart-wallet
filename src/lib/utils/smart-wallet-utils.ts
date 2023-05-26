import { ClarityValue, serializeCV } from "@stacks/transactions";

export const cvToHex = (cv: ClarityValue) => {
  const serialized = serializeCV(cv);
  return `0x${serialized.toString('hex')}`;
};
