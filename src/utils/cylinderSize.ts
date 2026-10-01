/** Cylinder label helpers — used by the mocks to label empties the way the API does. */

/** "19 KG Commercial" -> "19 KG Empty"; labels without a size become "Empty <label>". */
export const emptyLabelFor = (label: string): string => {
  const size = label.match(/^\s*(\d+(?:\.\d+)?\s*kg)\b/i);
  return size ? `${size[1].toUpperCase().replace(/\s+/g, ' ')} Empty` : `Empty ${label}`;
};
