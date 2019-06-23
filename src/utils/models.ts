type BaseModel = Readonly<{
  id: number;
  uuid: Uuid;
  createdAt: string;
  updatedAt: string;
}>;

export type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export interface Resume extends BaseModel {
  name: string;
}

export interface Resume extends BaseModel {
  name: string;
}

export interface Experience extends BaseModel {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}
