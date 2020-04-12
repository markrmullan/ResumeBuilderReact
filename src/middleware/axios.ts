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
    let { href } = window.location;

    if (error.response.status === 401 && href !== ROUTES.login) {
        href = ROUTES.login;
      }

    return Promise.reject(error);
    }
  );

  return axiosInstance;
};
