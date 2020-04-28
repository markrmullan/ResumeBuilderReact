import axios, { AxiosRequestConfig } from 'axios';

import { ROUTES } from 'utils/constants';

declare module 'axios' {
  export interface AxiosStatic {
    createWith401Handler: (config: AxiosRequestConfig) => AxiosInstance;
  }
}

axios.createWith401Handler = (config: AxiosRequestConfig) => {
  const axiosInstance = axios.create(config);

  axiosInstance.interceptors.response.use(_ => _, error => {
    const { pathname } = window.location;

    if (error && error.response && error.response.status === 401 && pathname !== ROUTES.login) {
        window.location.href = ROUTES.login;
      }

    return Promise.reject(error);
    }
  );

  return axiosInstance;
};
