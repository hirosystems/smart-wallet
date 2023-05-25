export const openTxLink = (txId: string, network: string) => {
  window.open(
    `https://explorer.hiro.so/txid/${txId}?chain=${network}`,
    '_blank'
  );
};
