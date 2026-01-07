export interface Room {
  id: number;
  roomnumber: string;
  price: number;
  building_id: number;
  is_highlighted: boolean;
  contract_id?: number;
  // Voeg hier eventueel document/afbeelding relatie toe indien nodig
}
