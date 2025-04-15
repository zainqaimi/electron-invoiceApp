import { packingTypes } from '../models/packingTypes.js';

export function convertToBaseUnit(quantity, packingTypeId) {
  const type = packingTypes.find(pt => pt.id === packingTypeId);
  if (!type) throw new Error('Invalid packing type');
  return quantity * type.toBaseUnit;
}
