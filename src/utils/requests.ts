import { get } from './api';
import { User } from './models';

export const getCurrentUser = (): Promise<User> => {
  return get<User>('users/current');
};
