import { Street } from './street';
import { Place } from './place';
import { User } from './user';

export interface Building {
  id: number;
  housenumber: string;
  street?: Street;
  place?: Place;
  owner?: User;
}
