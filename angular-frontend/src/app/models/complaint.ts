import { ComplaintType } from './complaint-type';
import { User } from './user';
export interface Complaint {
  id: number;
  name: string;
  description: string;
  user?: User;
  complaint_type?: ComplaintType;
}
