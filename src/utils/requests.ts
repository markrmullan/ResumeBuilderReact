import { ApiQuery, destroy, get, patch, post } from './api';
import { Experience, Resume, User } from './models';

export const logOut = (): Promise<void> => {
  return destroy<void>('users/sign_out');
};

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

export const fetchResumes = (): Promise<Resume[]> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes'
  };

  return get<Resume[]>(query);
};

export const createResume = (name: string): Promise<Resume> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes'
  };

  const body = {
    name
  };

  return post<Resume>(query, body);
};

export const deleteResume = (resumeId: Uuid): Promise<void> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId
  };

  return destroy<void>(query);
};

export const patchCurrentUser = (user: User): Promise<User> => {
  const query: Partial<ApiQuery> = {
    baseResourceId: user.uuid
  };

  return patch<User>(query, user);
};

export const createWorkExperience = (resumeId: Uuid, experience: Experience = {} as Experience): Promise<Experience> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['experiences']
  };

  return post<Experience>(query, experience);
};

export const patchWorkExperience = (resumeId: Uuid, experience: Partial<Experience> = {}): Promise<Experience> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['experiences'],
    nestedResourceIds: [experience.uuid!]
  };

  return patch<Experience>(query, experience);
};

export const deleteWorkExperience = (resumeId: Uuid, experienceId: Uuid): Promise<void> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['experiences'],
    nestedResourceIds: [experienceId]
  };

  return destroy<void>(query);
};
