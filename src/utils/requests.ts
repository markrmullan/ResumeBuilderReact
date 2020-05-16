import { ApiQuery, destroy, get, patch, post } from './api';
import { Education, Experience, FeatureFlag, FeatureFlagEnum, Link, Resume, User } from './models';

export const logOut = (): Promise<void> => {
  return destroy<void>('users/sign_out');
};

export const fetchCurrentUser = (): Promise<User> => {
  return get<User>('users/current');
};

export const patchCurrentUser = (user: User): Promise<User> => {
  const query: Partial<ApiQuery> = {
    baseResourceId: user.uuid
  };

  return patch<User>(query, user);
};

export const fetchUsers = (): Promise<User[]> => {
  return get<User[]>('users');
};

export const becomeUser = (userId: Uuid): Promise<void> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'users',
    baseResourceId: userId,
    nestedResources: ['become']
  };

  return post<void>(query);
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

export const patchResume = (resume: Partial<Resume>): Promise<Resume> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resume.uuid
  };

  return patch<Resume>(query, resume);
};

export const deleteResume = (resumeId: Uuid): Promise<void> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId
  };

  return destroy<void>(query);
};

export const createWorkExperience = (resumeId: Uuid, experience: Partial<Experience> = {}): Promise<Experience> => {
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

export const createEducation = (resumeId: Uuid, education: Partial<Education> = {}): Promise<Education> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['educations']
  };

  return post<Education>(query, education);
};

export const patchEducation = (resumeId: Uuid, education: Partial<Education> = {}): Promise<Education> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['educations'],
    nestedResourceIds: [education.uuid!]
  };

  return patch<Education>(query, education);
};

export const deleteEducation = (resumeId: Uuid, educationId: Uuid): Promise<void> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['educations'],
    nestedResourceIds: [educationId]
  };

  return destroy<void>(query);
};

export const createLink = (resumeId: Uuid, link: Partial<Link> = {}): Promise<Link> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['links']
  };

  return post<Link>(query, link);
};

export const patchLink = (resumeId: Uuid, link: Partial<Link> = {}): Promise<Link> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['links'],
    nestedResourceIds: [link.uuid!]
  };

  return patch<Link>(query, link);
};

export const deleteLink = (resumeId: Uuid, linkId: Uuid): Promise<void> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'resumes',
    baseResourceId: resumeId,
    nestedResources: ['links'],
    nestedResourceIds: [linkId]
  };

  return destroy<void>(query);
};

export const getFeatureFlag = (name: FeatureFlagEnum): Promise<FeatureFlag> => {
  const query: Partial<ApiQuery> = {
    baseResource: 'feature_flags',
    baseResourceId: name
  };

  return get<FeatureFlag>(query);
};

export const createPasswordResetEmail = (user: Pick<User, 'email'>) => {
  return post<{}>('users/password', { user });
};

export const resetPassword = (user: Pick<User, 'password' | 'resetPasswordToken'>) => {
  return patch<{}>('users/password', { user });
};
