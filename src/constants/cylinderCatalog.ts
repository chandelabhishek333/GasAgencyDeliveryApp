import type { CylinderType } from '../types';

export interface CylinderCatalogItem {
  cylinderType: CylinderType;
  label: string;
  /**
   * Standard rate per cylinder from the API spec's master enum table. The
   * server prices every order itself (update-items returns the new bill),
   * so the app only uses this in the dev mocks.
   */
  unitPrice: number;
}

/** The master cylinder types — the rows of Confirm Delivery's "Update Order" sheet. */
export const CYLINDER_CATALOG: CylinderCatalogItem[] = [
  { cylinderType: '5_KG_DOMESTIC', label: '5 KG Domestic', unitPrice: 550 },
  { cylinderType: '14.2_KG_DOMESTIC', label: '14.2 KG Domestic', unitPrice: 900 },
  { cylinderType: '19_KG_COMMERCIAL', label: '19 KG Commercial', unitPrice: 1800 },
  { cylinderType: '35_KG_INDUSTRIAL', label: '35 KG Industrial', unitPrice: 3300 },
  { cylinderType: '47.5_KG_INDUSTRIAL', label: '47.5 KG Industrial', unitPrice: 4450 },
];
