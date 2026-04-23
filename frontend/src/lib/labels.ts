
/** Textos en español para valores que el API guarda en inglés. */

export const ORDER_STATUS_ES: Record<string, string> = {
  pending: 'Pendiente',
  in_kitchen: 'En cocina',
  ready: 'Listo',
  delivered: 'Entregado',
  paid: 'Pagado',
};

export const ORDER_TYPE_ES: Record<string, string> = {
  dine_in: 'En local',
  takeaway: 'Para llevar',
  delivery: 'Domicilio',
};

export const TABLE_STATUS_ES: Record<string, string> = {
  available: 'Libre',
  occupied: 'Ocupada',
  reserved: 'Reservada',
};

export const PAYMENT_METHOD_ES: Record<string, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  mixed: 'Mixto',
};

export const ROLE_ES: Record<string, string> = {
  super_admin: 'Super administrador',
  manager: 'Gerente',
  cashier: 'Cajero',
  waiter: 'Mesero',
  cook: 'Cocinero',
  barman: 'Barman',
  admin: 'Administrador',
};

export function orderStatusEs(code: string): string {
  return ORDER_STATUS_ES[code] ?? code;
}

export function orderTypeEs(code: string): string {
  return ORDER_TYPE_ES[code] ?? code;
}

export function tableStatusEs(code: string): string {
  return TABLE_STATUS_ES[code] ?? code;
}

export function paymentMethodEs(code: string): string {
  return PAYMENT_METHOD_ES[code] ?? code;
}

export function roleEs(code: string): string {
  return ROLE_ES[code] ?? code;
}
