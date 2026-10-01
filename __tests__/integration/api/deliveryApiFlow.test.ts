/** Runs the dev mock backend through the v3 mappers: today -> out-for-delivery -> verify-location -> update-items -> QR -> confirm -> OTP -> completed-detail/history. */
import { resolveMockResponse } from '../../../src/api/mocks/mockHandlers';
import {
  toCompletedDetail, toConfirmResponse, toDeliverySummary, toGenerateQr, toHistoryPage, toInventory,
  toDriver, toOrders, toOutForDelivery, toSingleOrder, toUnreadCount, toVerifyLocation, toDutyStatus,
} from '../../../src/api/mappers/deliveryMappers';

const B = '/api/v1/delivery';
const call = (method: string, url: string, data?: unknown, params?: unknown) =>
  resolveMockResponse({ method, url, data: data === undefined ? undefined : JSON.stringify(data), params } as never).data;

test('full mock delivery flow maps through v3 mappers', () => {
  const today = toOrders(call('get', `${B}/deliveries/today`));
  expect(today).toHaveLength(12);
  const o = today.find((d) => d.id === 'ORD1257')!;
  expect(o.status).toBe('pending');
  expect(o.customer.isLocationCaptured).toBe(false);
  expect(o.billing.totalPayableAmount).toBe(4 * 1800 + 2 * 4450);
  const empty19 = o.items.find((i) => i.kind === 'emptyCollection' && i.cylinderType === '19_KG_COMMERCIAL')!;
  expect(empty19.quantity).toBe(5);
  expect(empty19.label).toBe('19 KG Empty');

  expect(toOutForDelivery(call('post', `${B}/deliveries/ORD1257/out-for-delivery`)).status).toBe('out_for_delivery');
  const loc = toVerifyLocation(call('post', `${B}/deliveries/ORD1257/verify-location`, { latitude: 1, longitude: 2 }));
  expect(loc).toMatchObject({ isAtLocation: true, isLocationCaptured: true });

  const updated = toSingleOrder(call('put', `${B}/deliveries/ORD1257/update-items`, {
    updatedItems: [{ cylinderType: '19_KG_COMMERCIAL', quantity: 5 }, { cylinderType: '5_KG_DOMESTIC', quantity: 1 }],
    reason: 'test',
  }));
  expect(updated.billing.totalPayableAmount).toBe(5 * 1800 + 550);
  // 47.5 dropped (no previous due) -> no empty line; 19 keeps its due of 1
  expect(updated.items.filter((i) => i.kind === 'emptyCollection').map((i) => [i.cylinderType, i.quantity])).toEqual([
    ['19_KG_COMMERCIAL', 6], ['5_KG_DOMESTIC', 1],
  ]);
  expect(updated.items[0].id).toBe('ORD1257-cylinder-19_KG_COMMERCIAL');

  const qr = toGenerateQr(call('post', `${B}/deliveries/ORD1257/generate-qr`, { amount: 5000, paymentSplit: 'partial' }));
  expect(qr).toMatchObject({ amount: 5000, expiresInSeconds: 600, orderNumber: 'ORD1257' });
  expect(qr.upiString).toContain('am=5000.00');

  const confirm = toConfirmResponse(call('post', `${B}/deliveries/ORD1257/confirm`, {
    deliveredItems: [{ cylinderType: '19_KG_COMMERCIAL', quantity: 5 }, { cylinderType: '5_KG_DOMESTIC', quantity: 1 }],
    collectedEmpties: [{ cylinderType: '19_KG_COMMERCIAL', quantity: 4 }, { cylinderType: '5_KG_DOMESTIC', quantity: 0 }],
    payment: { method: 'upi_qr', split: 'partial', amountCollected: 5000, payableAmount: 9550, pendingBalance: 4550 },
    driverNotes: 'note',
  }));
  expect(confirm.customerOtpRequired).toBe(true);

  const receipt = toDeliverySummary(call('post', `${B}/deliveries/ORD1257/verify-customer-otp`, { otp: '1234' }));
  expect(receipt.totalDeliveredQuantity).toBe(6);
  expect(receipt.emptyCollectedItems).toEqual([{ cylinderType: '19_KG_COMMERCIAL', label: '19 KG Empty', quantity: 4 }]);
  expect(receipt.emptyDueSummary).toEqual({ expectedTotal: 7, collectedTotal: 4, addedToCustomerPendingDue: 3 });
  expect(receipt.payment).toMatchObject({ method: 'upi_qr', split: 'partial', totalBillAmount: 9550, pendingBalance: 4550 });

  const detail = toCompletedDetail(call('get', `${B}/deliveries/ORD1257/completed-detail`));
  expect(detail).toMatchObject({ status: 'completed', driverNotes: 'note', payment: { amountPaid: 5000, pendingBalance: 4550 } });
  const seeded = toCompletedDetail(call('get', `${B}/deliveries/ORD1254/completed-detail`));
  expect(seeded.emptyItems.find((i) => i.cylinderType === '19_KG_COMMERCIAL')!.quantity).toBe(3);

  const hist = toHistoryPage(call('get', `${B}/deliveries/history`, undefined, { period: 'today', page: 1, limit: 20 }));
  expect(hist.items.map((h) => h.id)).toEqual(['ORD1257', 'ORD1254', 'ORD1253']);
  expect(hist.items[0].itemsSummary).toBe('5 × 19 KG, 1 × 5 KG');
  expect(toHistoryPage(call('get', `${B}/deliveries/history?period=all`)).total).toBe(6);
  expect(toHistoryPage(call('get', `${B}/deliveries/history?period=week`)).total).toBe(5);

  expect(toOrders(call('get', `${B}/deliveries/today`)).find((d) => d.id === 'ORD1257')!.status).toBe('completed');

  // Every history row opens a completed-detail, including past and failed ones.
  for (const entry of toHistoryPage(call('get', `${B}/deliveries/history?period=all`)).items) {
    expect(toCompletedDetail(call('get', `${B}/deliveries/${entry.id}/completed-detail`)).id).toBe(entry.id);
  }
  const failed = toCompletedDetail(call('get', `${B}/deliveries/ORD1240/completed-detail`));
  expect(failed).toMatchObject({ status: 'failed', payment: null, deliveredItems: [] });
  expect(toCompletedDetail(call('get', `${B}/deliveries/ORD1251/completed-detail`)).payment).toMatchObject({
    amountPaid: 8000, pendingBalance: 4 * 1800 + 2 * 4450 - 8000,
  });

  expect(toInventory(call('get', `${B}/driver/inventory`)).stockByType).toHaveLength(3);
  expect(toInventory({ fullCylinderCount: 3, emptyCylinderCount: 1, activeDeliveries: 0 })).toMatchObject({ totalFullCylinders: 3, totalEmptyCylinders: 1 });
  expect(toDriver(call('get', `${B}/driver/profile`)).shiftStats!.cashCollectedToday).toBe(24250);
  expect(toDutyStatus(call('patch', `${B}/driver/status`, { onDuty: false }))).toEqual({ onDuty: false });
  expect(toUnreadCount(call('get', `${B}/notifications/unread-count`))).toBe(2);
  expect(toUnreadCount({ unread: 4 })).toBe(4);
  call('post', `${B}/notifications/read-all`);
});

test('mappers coerce Decimal strings and legacy statuses', () => {
  const [o] = toOrders({ success: true, data: [{ id: 'x', orderNumber: 'X', status: 'in_progress', customer: { name: 'n', phone: 'p', address: 'a' },
    items: [{ cylinderType: '19_KG_COMMERCIAL', label: '19 KG Commercial', quantity: '2', unitPrice: '1800.00', totalPrice: '3600.00' }],
    emptyReturns: [], completedAt: '2026-09-30T10:58:00' }] });
  expect(o.status).toBe('out_for_delivery');
  expect(o.billing.totalPayableAmount).toBe(3600);
  expect(o.items[0].quantity).toBe(2);
  expect(o.completedAt).toBe('10:58 AM');
});
