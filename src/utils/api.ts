import axios from 'axios';
import 'middleware/axios';

const axiosInstance = axios.createWith401Handler({
  baseURL: PRODUCTION ? 'https://api.easy-resu.me/' : 'http://localhost:3001/',
  withCredentials: true
});

export type ApiQuery = {
  path?: string;
  baseResource: BaseResource;
  baseResourceId: Uuid;
  nestedResources: NestedResource[];
  nestedResourceIds: Uuid[];
  queries: Query[];
};

const getDefaultApiQuery = (): ApiQuery => {
  return {
    baseResource: 'users',
    baseResourceId: '',
    nestedResources: [],
    nestedResourceIds: [],
    queries: []
  };
};

export const url = (params: Partial<ApiQuery>) => {
  const apiQuery: ApiQuery = { ...getDefaultApiQuery(), ...params };
  const { path, baseResource, baseResourceId, nestedResources, nestedResourceIds, queries } = apiQuery;

  let baseUrl = path || `${baseResource}/${baseResourceId}`;

  nestedResources.forEach((nestedResource, index) => {
    const id = nestedResourceIds[index];

    baseUrl += `/${nestedResource}${id ? `/${id}` : ''}`;
  });

  const queryStrings = queries.map(query => {
    const key = Object.keys(query)[0];
    const value = query[key];

    return `${key}=${value}`;
  });

  if (queryStrings.length) {
    return `/${baseUrl}?${queryStrings.join('&')}`;
  }

  return `/${baseUrl}`;
};

export const get = async <T> (params: Partial<ApiQuery> | string): Promise<T> => {
  if (typeof params === 'string') params = { path: params };

  const response = await axiosInstance.get<T>(url(params));

  return response.data as unknown as T;
};

export const post = async <T> (params: Partial<ApiQuery>, data: object = {}): Promise<T> => {
  try {
    const response = await axiosInstance.post(url(params), data) || {};

    return response.data as unknown as Promise<T>;
  } catch ({ response }) {
    throw response;
  }
};

export const patch = async <T> (params: Partial<ApiQuery>, data: object = {}): Promise<T> => {
  const response = await axiosInstance.patch(url(params), data) || {};

  return response.data as unknown as Promise<T>;
};

export const destroy = async <T> (params: Partial<ApiQuery> | string): Promise<T> => {
  if (typeof params === 'string') params = { path: params };

  const response = await axiosInstance.delete(url(params)) || {};

  return response.data as unknown as Promise<T>;
};

type BaseResource = 'resumes' | 'users';

type NestedResource = 'experiences' | 'educations' | 'links' | 'become';

type Query = Obj<string>;
