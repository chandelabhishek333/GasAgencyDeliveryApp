import type { OrderItem, OrderItemKind } from '../types';

const sumKind = (items: OrderItem[], quantities: Record<string, number>, kind: OrderItemKind): number =>
  items
    .filter((item) => item.kind === kind)
    .reduce((total, item) => total + (quantities[item.id] ?? 0), 0);

/** Totals across every cylinder type for Confirm Delivery's per-item quantities (keyed by OrderItem.id). */
export const getDeliveryTotals = (
  items: OrderItem[],
  quantities: Record<string, number>,
): { delivered: number; collected: number } => ({
  delivered: sumKind(items, quantities, 'cylinderDelivery'),
  collected: sumKind(items, quantities, 'emptyCollection'),
});
