const BASE_URL =
  process.env.ENV === 'production'
    ? process.env.PRODUCTION_URL
    : 'http://localhost:3000';

type methodType = 'POST' | 'GET' | 'PUT' | 'DELETE';

const requestOptions = (
  data: object,
  method?: methodType,
  headers?: HeadersInit,
): RequestInit => ({
  method: method || 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  ...(method !== 'GET' && { body: JSON.stringify(data) }),
});

export const getRequest = (url: string, headers?: HeadersInit) => {
  return fetch(BASE_URL + '/api' + url, { headers });
};

export const postRequest = (url: string, data = {}, headers?: HeadersInit) => {
  return fetch(BASE_URL + '/api' + url, requestOptions(data, 'POST', headers));
};

export const putRequest = (url: string, data = {}, headers?: HeadersInit) => {
  return fetch(BASE_URL + '/api' + url, requestOptions(data, 'PUT', headers));
};

export const deleteRequest = (
  url: string,
  data = {},
  headers?: HeadersInit,
) => {
  return fetch(
    BASE_URL + '/api' + url,
    requestOptions(data, 'DELETE', headers),
  );
};
