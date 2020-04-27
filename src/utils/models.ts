type BaseModel = Readonly<{
  uuid: Uuid;
  createdAt: string;
  updatedAt: string;
}>;

export interface User extends BaseModel {
  email: string;
  resumeEmail?: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city?: string;
  state?: string;
  zip?: string;
  jobTitle?: string;
}

export interface Resume extends BaseModel {
  educations: Education[];
  experiences: Experience[];
  links: Link[];
  jobTitle: string;
  name: string;
}

export interface Experience extends BaseModel {
  company: string;
  description: string;
  location: string;
  position: string;
  startDate: string;
  endDate: Nullable<string>;
}

export interface Education extends BaseModel {
  degree: string;
  description: string;
  gpa: string;
  school: string;
  startDate: string;
  endDate: Nullable<string>;
}

export interface Link extends BaseModel {
  url?: string;
}
