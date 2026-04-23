
export type User = { id: number; username: string; full_name: string; email: string; role: string; is_active: boolean };
export type Category = { id: number; name: string; description?: string; icon?: string };
export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  is_available: boolean;
  preparation_time?: number;
  allergens?: string;
  tags?: string;
};
export type OrderLine = {
  id: number;
  menu_item_id: number;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  notes?: string | null;
};
export type Order = {
  id: number;
  table_id?: number | null;
  waiter_id: number;
  status: string;
  order_type: string;
  notes?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  created_at?: string;
};
export type OrderDetail = Order & { items: OrderLine[] };
export type RestaurantTable = {
  id: number;
  number: number;
  capacity: number;
  status: string;
  location?: string;
};
export type Payment = { id: number; order_id: number; method: string; amount: number; processed_by_id: number; is_voided: boolean };
