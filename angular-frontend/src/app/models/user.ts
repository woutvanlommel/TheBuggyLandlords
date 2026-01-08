import { Role } from './role';

export interface User {
  id: number;
  fname: string;
  name: string;
  email: string;
  phone?: string;
  credits?: number;
  role?: Role;
}
