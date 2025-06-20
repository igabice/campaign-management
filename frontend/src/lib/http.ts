import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PaginatedResponse } from '../types/commons';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/v1/';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const serverErrorMessage = (error.response.data as { message?: string })?.message;
      if (serverErrorMessage) {
        error.message = serverErrorMessage;
      }
    }
    return Promise.reject(error);
  }
);

export const get = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.get<T, R>(url, config);
};

export const getPaginated = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<PaginatedResponse<T>>> => {
  return axiosInstance.get<PaginatedResponse<T>>(url, config);
};


export const post = async <T = any, D = any, R = AxiosResponse<T>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.post<T, R, D>(url, data, config);
};


export const patch = async <T = any, D = any, R = AxiosResponse<T>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.patch<T, R, D>(url, data, config);
};

export const del = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.delete<T, R>(url, config);
};

export default axiosInstance;