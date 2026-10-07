import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductItem from '../components/ProductItem';

describe('Pruebas del componente ProductItem', () => {
  const mockProduct = {
    id: 'prod-123',
    name: 'Café Tostado',
    category: 'Almacén',
    quantity: 2,
    price: 3500,
  };

  test('Renderiza el componente ProductItem y muestra la información del producto', async () => {
    const { getByText } = await render(
      <ProductItem product={mockProduct} onDelete={jest.fn()} />
    );

    expect(getByText('Café Tostado')).toBeTruthy();
    expect(getByText('Almacén')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  test('Renderiza el componente ProductItem con datos de prueba y simula presionar el botón de eliminar, verificando que la función onDelete sea invocada', async () => {
    const onDeleteMock = jest.fn();

    const { getByTestId } = await render(
      <ProductItem product={mockProduct} onDelete={onDeleteMock} />
    );

    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith('prod-123');
  });
});
