import axios from 'axios';
import 'middleware/axios';

const axiosInstance = axios.createWith401Handler({
  baseURL: DEVELOPMENT ? 'http://localhost:3001/' : '',
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
  const { path, baseResource, baseResourceId, queries } = apiQuery;

  const baseUrl = path || `${baseResource}/${baseResourceId}`;

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

export const get = async (params: Partial<ApiQuery> | string): Promise<any> => {
  if (typeof params === 'string') params = { path: params };

  const response = await axiosInstance.get(url(params));

  return response;
};

export const post = async (params: Partial<ApiQuery>, data: object = {}) => {
  const response = await axiosInstance.post(url(params), data);

  return response;
};

type BaseResource = 'resumes' | 'experiences' | 'users';

type NestedResource = 'experiences';

type Query = Obj<string>;
