/**
 * Cylinder-size helpers shared by the API mappers, Home's delivery rows and
 * Confirm Delivery's Update Order sheet. Order items carry no explicit
 * size field, so size is read from the start of the label.
 */

/** "19 KG Commercial" / "19 kg Empty" -> "19kg"; null when the label has no leading size. */
export const cylinderSizeKey = (label: string): string | null => {
  const match = label.match(/^\s*(\d+(?:\.\d+)?)\s*kg\b/i);
  return match ? `${match[1]}kg` : null;
};

/** "19 KG Commercial" -> "19 KG Empty"; labels without a size become "Empty <label>". */
export const emptyLabelFor = (label: string): string => {
  const size = label.match(/^\s*(\d+(?:\.\d+)?\s*kg)\b/i);
  return size ? `${size[1].toUpperCase().replace(/\s+/g, ' ')} Empty` : `Empty ${label}`;
};
