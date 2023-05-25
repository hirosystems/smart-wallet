export const openTxLink = (txId: string, network: string) => {
  console.log({ txId, network })
  const queryParameters = new URLSearchParams({ chain: network });
  if (network === 'devnet') {
    queryParameters.set('api', 'http://localhost:3999');
  }
  const params = queryParameters.toString() ? '?' + queryParameters.toString() : '';
  const url = `https://explorer.hiro.so/txid/${txId}${params}`;
  console.log({ url });
  window.open(url, '_blank');
};
