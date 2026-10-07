import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  REGISTERED_USER: '@registered_user',
  USER_SESSION: '@user_session',
  SHOPPING_LIST: '@shopping_list',
};

export const DEFAULT_USER = {
  username: 'garce',
  password: '123456',
};

export const getRegisteredUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USER);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  } catch (error) {
    console.error('Error al obtener usuario registrado:', error);
    return DEFAULT_USER;
  }
};

export const saveRegisteredUser = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USER, jsonValue);
    return true;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error al obtener sesión de usuario:', error);
    return null;
  }
};

export const saveUserSession = async (sessionData) => {
  try {
    const payload = {
      ...sessionData,
      loggedInAt: sessionData.loggedInAt || new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Error al guardar sesión:', error);
    throw error;
  }
};

export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

export const getShoppingList = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
    if (!jsonValue) return [];
    const parsed = JSON.parse(jsonValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al obtener la lista de compras:', error);
    return [];
  }
};

export const saveShoppingList = async (list) => {
  try {
    const jsonValue = JSON.stringify(list);
    await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, jsonValue);
    return true;
  } catch (error) {
    console.error('Error al guardar la lista de compras:', error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const currentList = await getShoppingList();
    const newProduct = {
      id: product.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: product.name.trim(),
      category: product.category.trim(),
      quantity: parseFloat(product.quantity) || 1,
      price: parseFloat(product.price) || 0,
      createdAt: new Date().toISOString(),
    };
    const updatedList = [newProduct, ...currentList];
    await saveShoppingList(updatedList);
    return updatedList;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const currentList = await getShoppingList();
    const updatedList = currentList.filter((item) => item.id !== productId);
    await saveShoppingList(updatedList);
    return updatedList;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

export const clearShoppingList = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SHOPPING_LIST);
    return true;
  } catch (error) {
    console.error('Error al limpiar lista de compras:', error);
    throw error;
  }
};
