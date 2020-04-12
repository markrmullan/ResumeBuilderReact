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
  jobTitle: string;
  name: string;
}

export interface Experience extends BaseModel {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}
