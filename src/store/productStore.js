import { create } from 'zustand';
import { getShoppingList, saveShoppingList } from '../services/storage';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,

  loadProducts: async () => {
    const products = await getShoppingList();
    set({ products, loading: false });
  },

  addProduct: async (data) => {
    const product = {
      id: data.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: data.name.trim(),
      category: data.category.trim(),
      quantity: parseFloat(data.quantity) || 1,
      price: parseFloat(data.price) || 0,
      imageUri: data.imageUri || null,
      location: data.location || null,
      contact: data.contact || null,
      calendarEventId: data.calendarEventId || null,
      createdAt: new Date().toISOString(),
    };
    const products = [product, ...get().products];
    set({ products });
    await saveShoppingList(products);
    return product;
  },

  updateProduct: async (id, changes) => {
    const products = get().products.map((p) => (p.id === id ? { ...p, ...changes } : p));
    set({ products });
    await saveShoppingList(products);
  },

  removeProduct: async (id) => {
    const products = get().products.filter((p) => p.id !== id);
    set({ products });
    await saveShoppingList(products);
  },
}));
