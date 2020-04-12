import { ApiQuery, get, patch } from './api';
import { Resume, User } from './models';

export const fetchCurrentUser = (): Promise<User> => {
  return get<User>('users/current');
};

export const fetchResume = (resumeId: Uuid): Promise<Resume> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId
  };

  return get<Resume>(query);
};

export const patchCurrentUser = (user: User): Promise<User> => {
  const query: Partial<ApiQuery> = {
    baseResourceId: user.uuid
  };

  return patch<User>(query, user);
};
