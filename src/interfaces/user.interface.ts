export interface IUser {
  _id?: string;
  nombre: string;
  cc: string;
  email: string;
  password: string;
  role: string;
}

export interface UserSession {
  id: string;
  nombre: string;
  email: string;
  role: string;
}