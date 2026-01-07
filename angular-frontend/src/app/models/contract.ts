export interface Contract {
  id: number;
  user_id?: number;
  room_id?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
