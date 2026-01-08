import { User } from './user';
import { Room } from './room';

export interface Contract {
  id: number;
  user?: User;
  room?: Room;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
