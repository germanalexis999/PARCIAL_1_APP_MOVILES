import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProductStore } from '../store/productStore';

describe('productStore (Zustand)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useProductStore.setState({ products: [], loading: false });
  });

  it('agrega un producto con foto, ubicación y contacto', async () => {
    await useProductStore.getState().addProduct({
      name: 'Leche', category: 'Lácteos', quantity: '2', price: '100',
      imageUri: 'file://a.jpg', location: { latitude: 1, longitude: 2 }, contact: { id: '1', name: 'Ana' },
    });
    const [p] = useProductStore.getState().products;
    expect(p.name).toBe('Leche');
    expect(p.imageUri).toBe('file://a.jpg');
    expect(p.contact.name).toBe('Ana');
  });

  it('actualiza y elimina un producto', async () => {
    const { addProduct, updateProduct, removeProduct } = useProductStore.getState();
    const p = await addProduct({ name: 'Pan', category: 'Panadería', quantity: 1, price: 50 });
    await updateProduct(p.id, { price: 80 });
    expect(useProductStore.getState().products[0].price).toBe(80);
    await removeProduct(p.id);
    expect(useProductStore.getState().products).toHaveLength(0);
  });
});
