import { Building } from './building';
import { Document } from './document';

export interface Room {
  id: number;
  roomnumber: string;
  price: number;
  building_id: number;
  is_highlighted: boolean;
  contract_id?: number;
  building?: Building;
  images?: Document[];
  // Voeg hier eventueel meer relaties toe
}
