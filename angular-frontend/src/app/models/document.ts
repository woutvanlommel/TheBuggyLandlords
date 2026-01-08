import { DocumentType } from './document-type';
import { User } from './user';
import { Contract } from './contract';
import { Room } from './room';

export interface Document {
  id: number;
  name: string;
  file_path: string;
  url?: string;
  document_type_id?: number;
  document_type?: DocumentType;
  user?: User;
  contract?: Contract;
  room?: Room;
}
