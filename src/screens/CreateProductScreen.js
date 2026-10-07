import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { addProduct } from '../services/storage';
import { schedulePurchaseReminder } from '../services/notifications';
import { validateProduct } from '../utils/calculations';

const PRESET_CATEGORIES = [
  'Verdulería',
  'Almacén',
  'Carnicería',
  'Lácteos',
  'Panadería',
  'Limpieza',
  'Bebidas',
  'Otro',
];

const CreateProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Almacén');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [enableReminder, setEnableReminder] = useState(true);
  const [reminderSeconds, setReminderSeconds] = useState(5);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProduct = async () => {
    setErrorMessage('');

    const validation = validateProduct({ name, category, quantity, price });
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    try {
      setLoading(true);

      const parsedQty = parseFloat(quantity);
      const parsedPrice = parseFloat(price);

      await addProduct({
        name: name.trim(),
        category: category.trim(),
        quantity: parsedQty,
        price: parsedPrice,
      });

      let reminderMsg = '';
      if (enableReminder) {
        try {
          await schedulePurchaseReminder(name.trim(), reminderSeconds);
          reminderMsg = `\n\nRecordatorio programado para dentro de ${reminderSeconds} segundos.`;
        } catch (notifErr) {
          console.warn('No se pudo programar la notificación:', notifErr);
        }
      }

      Alert.alert(
        '¡Producto Guardado!',
        `"${name.trim()}" se ha agregado con éxito a tu lista.${reminderMsg}`,
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrorMessage('Ocurrió un error al guardar el producto. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuevo Producto</Text>
          <Text style={styles.cardSubtitle}>
            Completa la información del ítem que deseas comprar
          </Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Producto *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Leche descremada, Manzanas"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              testID="product-name-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <View style={styles.chipsContainer}>
              {PRESET_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flexHalf, { marginRight: 8 }]}>
              <Text style={styles.label}>Cantidad *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 2"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                testID="product-quantity-input"
              />
            </View>

            <View style={[styles.inputGroup, styles.flexHalf, { marginLeft: 8 }]}>
              <Text style={styles.label}>Precio Estimado ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 1200.50"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
                testID="product-price-input"
              />
            </View>
          </View>

          <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>Recordatorio de Compra</Text>
                <Text style={styles.reminderSubtitle}>
                  Notificar en {reminderSeconds} segundos al guardar
                </Text>
              </View>
              <Switch
                value={enableReminder}
                onValueChange={setEnableReminder}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={enableReminder ? '#2563EB' : '#F1F5F9'}
                testID="reminder-switch"
              />
            </View>
          </View>

          <CustomButton
            title="Guardar Producto"
            onPress={handleSaveProduct}
            loading={loading}
            variant="secondary"
            style={styles.saveButton}
            testID="save-product-button"
          />

          <CustomButton
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexHalf: {
    flex: 1,
  },
  reminderCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderInfo: {
    flex: 1,
    paddingRight: 10,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
  },
  saveButton: {
    marginTop: 4,
    backgroundColor: '#059669',
  },
  cancelButton: {
    marginTop: 6,
    borderColor: '#94A3B8',
  },
});

export default CreateProductScreen;
