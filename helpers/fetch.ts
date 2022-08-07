const BASE_URL =
  process.env.ENV === 'production'
    ? process.env.PRODUCTION_URL
    : 'http://localhost:3000';

type methodType = 'POST' | 'GET' | 'PUT' | 'DELETE';

const requestOptions = (data: object, method?: methodType): RequestInit => ({
  method: method || 'POST',
  headers: { 'Content-Type': 'application/json' },
  ...(method !== 'GET' && { body: JSON.stringify(data) }),
});

export const getRequest = (url: string) => {
  return fetch(BASE_URL + '/api' + url);
};

export const postRequest = (url: string, data = {}) => {
  return fetch(BASE_URL + '/api' + url, requestOptions(data, 'POST'));
};

export const putRequest = (url: string, data = {}) => {
  return fetch(BASE_URL + '/api' + url, requestOptions(data, 'PUT'));
};

export const deleteRequest = (url: string, data = {}) => {
  return fetch(BASE_URL + '/api' + url, requestOptions(data, 'DELETE'));
};
