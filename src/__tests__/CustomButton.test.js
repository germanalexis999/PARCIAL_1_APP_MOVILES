import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../components/CustomButton';

describe('Pruebas del componente CustomButton', () => {
  test('Renderiza el componente CustomButton y verifica que el texto provisto como prop se muestre correctamente', async () => {
    const buttonText = 'Guardar Producto';
    const { getByText } = await render(<CustomButton title={buttonText} onPress={() => {}} />);

    const textElement = getByText(buttonText);
    expect(textElement).toBeTruthy();
  });

  test('Invoca la función onPress al presionar el botón', async () => {
    const onPressMock = jest.fn();
    const { getByText } = await render(
      <CustomButton title="Presióname" onPress={onPressMock} />
    );

    const button = getByText('Presióname');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
