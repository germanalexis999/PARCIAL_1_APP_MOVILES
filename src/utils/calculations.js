export const calculateTotalCost = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return 0;
  }

  const total = products.reduce((accumulator, item) => {
    if (!item) return accumulator;
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return accumulator + qty * price;
  }, 0);

  return Math.round(total * 100) / 100;
};

export const formatCurrency = (amount) => {
  const numericAmount = parseFloat(amount) || 0;
  return `$${numericAmount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const validateProduct = ({ name, category, quantity, price }) => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { isValid: false, error: 'El nombre del producto es obligatorio.' };
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return { isValid: false, error: 'Debe seleccionar o ingresar una categoría.' };
  }

  const numQty = parseFloat(quantity);
  if (isNaN(numQty) || numQty <= 0) {
    return { isValid: false, error: 'La cantidad debe ser un número mayor a 0.' };
  }

  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return { isValid: false, error: 'El precio debe ser un número igual o mayor a 0.' };
  }

  return { isValid: true };
};
