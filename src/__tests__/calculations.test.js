import { calculateTotalCost } from '../utils/calculations';

describe('Pruebas unitarias de cálculos (calculations.js)', () => {
  test('calculateTotalCost suma correctamente el producto de cantidad * precio de una lista de elementos', () => {
    const productsMock = [
      { id: '1', name: 'Manzanas', category: 'Verdulería', quantity: 2, price: 500 },
      { id: '2', name: 'Leche', category: 'Lácteos', quantity: 3, price: 1200 },
      { id: '3', name: 'Pan', category: 'Panadería', quantity: 1, price: 800 },
    ];

    const total = calculateTotalCost(productsMock);
    expect(total).toBe(5400);
  });

  test('calculateTotalCost calcula correctamente subtotales con decimales', () => {
    const productsWithDecimals = [
      { id: '1', name: 'Queso', category: 'Lácteos', quantity: 1.5, price: 2000.5 },
      { id: '2', name: 'Tomate', category: 'Verdulería', quantity: 2.2, price: 1500 },
    ];

    const total = calculateTotalCost(productsWithDecimals);
    expect(total).toBe(6300.75);
  });

  test('calculateTotalCost convierte valores tipo string a numéricos correctamente', () => {
    const productsStringValues = [
      { id: '1', name: 'Arroz', category: 'Almacén', quantity: '3', price: '1100' },
    ];

    const total = calculateTotalCost(productsStringValues);
    expect(total).toBe(3300);
  });

  test('calculateTotalCost retorna 0 cuando la lista está vacía o es nula', () => {
    expect(calculateTotalCost([])).toBe(0);
    expect(calculateTotalCost(null)).toBe(0);
    expect(calculateTotalCost(undefined)).toBe(0);
  });
});
