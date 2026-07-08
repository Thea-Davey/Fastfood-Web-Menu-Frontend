export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  created_at?: string;
  name?: string;
}
