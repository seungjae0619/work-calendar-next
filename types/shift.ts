export interface Shift {
  id?: number;
  date: string;
  work_type: string;
  changed_work_type: string | null;
  isChanged?: boolean;
}
