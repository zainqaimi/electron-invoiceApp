// models/packingTypes.js
export const packingTypes = [
    {
      id: 'piece',
      label: 'Piece',
      toBaseUnit: 1
    },
    {
      id: 'carton',
      label: 'Carton',
      toBaseUnit: 48 // 1 carton = 48 pieces
    },
    {
      id: 'dozen',
      label: 'Dozen',
      toBaseUnit: 12
    },
    {
      id: 'bore',
      label: 'Bore',
      toBaseUnit: 144 * 12 // 1 bore = 144 dozen = 1728 pieces
    },
  ]
  