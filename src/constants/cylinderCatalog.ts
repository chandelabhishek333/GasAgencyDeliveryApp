export interface CylinderCatalogItem {
  label: string;
  /**
   * PLACEHOLDER rupee rate per cylinder — the live API exposes no prices yet.
   * Used only to recalculate the payable amount when the driver adds a new
   * cylinder type on Confirm Delivery. Replace with real rates (ideally from
   * the backend) before release.
   */
  unitPrice: number;
}

/** Cylinder types a driver can add to an order from Confirm Delivery's "Update Order" sheet. */
export const CYLINDER_CATALOG: CylinderCatalogItem[] = [
  { label: '5 KG Domestic', unitPrice: 550 },
  { label: '14.2 KG Domestic', unitPrice: 900 },
  { label: '19 KG Commercial', unitPrice: 1800 },
  { label: '35 KG Industrial', unitPrice: 3300 },
  { label: '47.5 KG Industrial', unitPrice: 4450 },
];
