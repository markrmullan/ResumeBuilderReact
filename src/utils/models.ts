type BaseModel = Readonly<{
  id: number;
  uuid: Uuid;
  created_at: string;
  updated_at: string;
}>;

export type User = {
  email: string;
  password: string;
};

export interface Experience extends BaseModel {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
};
