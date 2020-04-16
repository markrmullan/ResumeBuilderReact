type BaseModel = Readonly<{
  uuid: Uuid;
  createdAt: string;
  updatedAt: string;
}>;

export interface User extends BaseModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Resume extends BaseModel {
  educations: Education[];
  experiences: Experience[];
  jobTitle: string;
  name: string;
}

export interface Experience extends BaseModel {
  city: string;
  company: string;
  description: string;
  position: string;
  startDate: string;
  endDate: Maybe<string>;
}

export interface Education extends BaseModel {
  city: string;
  degree: string;
  description: string;
  school: string;
  startDate: string;
  endDate: Maybe<string>;
}
