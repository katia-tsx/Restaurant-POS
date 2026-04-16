
export type User = { id: number; username: string; full_name: string; email: string; role: string; is_active: boolean };
export type Category = { id: number; name: string; description?: string; icon?: string };
export type MenuItem = { id: number; name: string; description?: string; price: number; category_id: number; image_url?: string; is_available: boolean };
export type Order = { id: number; table_id?: number; waiter_id: number; status: string; order_type: string; total: number; created_at?: string };
export type Payment = { id: number; order_id: number; method: string; amount: number; processed_by_id: number; is_voided: boolean };
