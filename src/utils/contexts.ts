import { createContext } from 'react';
import { User } from './models';

export interface CurrentUserContext {
  user: User;
  updateUser: (currentUser: User) => void;
  patchCurrentUser: (toUpdate: User) => Promise<User>;
}

const DEFAULT_VALUES = {
  user: {} as User,
  updateUser: (_: User) => undefined,
  patchCurrentUser: async (_: User) => ({} as User)
};

export const CurrentUserContextImpl = createContext<CurrentUserContext>(DEFAULT_VALUES);
