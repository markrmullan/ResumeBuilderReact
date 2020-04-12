import { ApiQuery, get } from './api';
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
