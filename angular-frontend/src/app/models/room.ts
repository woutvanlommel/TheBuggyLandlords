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

  roomtype_id?: number; // toegevoegd: verwijzing naar het type van de kamer
  roomtype?: string; // toegevoegd: type van de kamer (Studio, Kamer, ...)
  description?: string; // toegevoegd: beschrijving van de kamer
  surface?: number; // toegevoegd: oppervlakte van de kamer in m²

  extra_costs?: any[];
  facilities?: any[];
}
