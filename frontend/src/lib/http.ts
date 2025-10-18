import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PaginatedResponse } from '../types/commons';

const API_BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/v1/` : 'http://localhost:3001/v1/';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
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
        // Check for subscription required error
        if (error.response.status === 403 && serverErrorMessage.includes("Active subscription required")) {
          // Dispatch custom event to show subscription modal
          window.dispatchEvent(new CustomEvent('show-subscription-modal'));
        }
        // Check for unauthorized error
        if (error.response.status === 401) {
          // Redirect to login page
          window.location.href = '/login';
          return Promise.reject(error);
        }
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
  // If data is FormData, don't set Content-Type header (let browser set it)
  const requestConfig = { ...config };
  if (data instanceof FormData) {
    if (requestConfig.headers) {
      delete requestConfig.headers['Content-Type'];
    }
  }
  return axiosInstance.post<T, R, D>(url, data, requestConfig);
};


export const patch = async <T = any, D = any, R = AxiosResponse<T>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.patch<T, R, D>(url, data, config);
};

export const put = async <T = any, D = any, R = AxiosResponse<T>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.put<T, R, D>(url, data, config);
};

export const del = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axiosInstance.delete<T, R>(url, config);
};

export default axiosInstance;