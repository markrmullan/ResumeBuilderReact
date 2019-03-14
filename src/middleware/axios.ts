import axios, { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosStatic {
    createWith401Handler: (config: AxiosRequestConfig) => AxiosInstance;
  }
};

axios.createWith401Handler = (config: AxiosRequestConfig) => {
  const axiosInstance = axios.create(config);

  axiosInstance.interceptors.response.use(_ => _,
    (error) => {
      if (error.response.status === 401) {
        window.location.href = '/login';
      }
    }
  );

  return axiosInstance;
};
