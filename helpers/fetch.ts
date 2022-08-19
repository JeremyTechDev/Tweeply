const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://tweeply-app.com/api'
    : 'http://localhost:3000/api';

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
  return fetch(`${BASE_URL}${url}`, { headers });
};

export const postRequest = (url: string, data = {}, headers?: HeadersInit) => {
  return fetch(`${BASE_URL}${url}`, requestOptions(data, 'POST', headers));
};

export const putRequest = (url: string, data = {}, headers?: HeadersInit) => {
  return fetch(`${BASE_URL}${url}`, requestOptions(data, 'PUT', headers));
};

export const deleteRequest = (
  url: string,
  data = {},
  headers?: HeadersInit,
) => {
  return fetch(`${BASE_URL}${url}`, requestOptions(data, 'DELETE', headers));
};
