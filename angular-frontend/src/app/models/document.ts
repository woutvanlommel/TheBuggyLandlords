export interface Document {
  id: number;
  name: string;
  file_path: string;
  document_type_id?: number;
  user_id?: number;
  contract_id?: number;
  room_id?: number;
}
