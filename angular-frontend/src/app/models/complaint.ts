export interface Complaint {
  id: number;
  name: string;
  description: string;
  complaint_type_id?: number;
  user_id?: number;
}
