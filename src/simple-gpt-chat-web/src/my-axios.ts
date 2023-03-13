import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// export const BaseUrl = 'https://chat-api.igz.app';
export const BaseUrl = 'http://localhost:20105';

const instance = axios.create({
  baseURL: BaseUrl,
  timeout: 60000,
});

// 请求拦截器
instance.interceptors.request.use(
  async (requestConfig) => {
    const token = await new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(window.sessionStorage.getItem('accessToken') ?? '');
      }, 0);
    });

    if (requestConfig.headers !== undefined) {
      requestConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      await new Promise((r) => setTimeout(r, 1000));
      return axios.request(error.response);
    }
    return Promise.reject(error);
  },
);

const get = <T>(url: string, params: any = {}): Promise<AxiosResponse<T>> => {
  return instance.get<T>(url, {
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const post = async <T>(
  url: string,
  params: any = {},
  dataFrom: dataFromType = 'fromBody',
): Promise<AxiosResponse<T>> => {
  let headers: object;

  if (dataFrom === 'fromBody') {
    headers = {
      'Content-Type': 'application/json',
    };

    return instance.post<T>(url, params, { headers });
  } else {
    headers = {
      'Content-Type': 'multipart/form-data',
    };
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }
    params = formData;
  }
  return instance.post<T>(url, params, { headers });
};

const request = async <T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  params: any = {},
  config: AxiosRequestConfig<any>,
) => {
  return instance.request<T>({
    url,
    method,
    params,
    ...config,
  });
};

declare const dataFromTypes: readonly ['fromBody', 'fromForm'];
type dataFromType = (typeof dataFromTypes)[number];

export const myAxios = { post, get, request };
