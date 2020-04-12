import { createContext } from 'react';
import { User } from './models';

export interface CurrentUserContext {
  user: User;
  updateUser: (currentUser: User) => void;
}

const DEFAULT_VALUES = {
  user: {} as User,
  updateUser: (_: User) => undefined
};

export const CurrentUserContextImpl = createContext<CurrentUserContext>(DEFAULT_VALUES);
