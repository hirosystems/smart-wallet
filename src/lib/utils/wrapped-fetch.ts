export function fetcher(input: RequestInfo, init: RequestInit = {}) {
  const initHeaders = init.headers || {};
  return fetch(input, {
    credentials: 'omit',
    ...init,
    // headers: { ...initHeaders, ...hiroHeaders },
    headers: { ...initHeaders },
  });
}
