import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { formatCurrency } from '../utils/calculations';

const CATEGORY_COLORS = {
  Verdulería: '#10B981',
  Almacén: '#F59E0B',
  Carnicería: '#EF4444',
  Lácteos: '#3B82F6',
  Limpieza: '#8B5CF6',
  Bebidas: '#06B6D4',
  Panadería: '#D97706',
  Otro: '#64748B',
};

const ProductItem = ({ product, onDelete }) => {
  if (!product) return null;

  const { id, name, category, quantity, price, imageUri, location, contact, calendarEventId } = product;
  const numQty = parseFloat(quantity) || 0;
  const numPrice = parseFloat(price) || 0;
  const subtotal = numQty * numPrice;
  const badgeColor = CATEGORY_COLORS[category] || '#64748B';

  const handleDeletePress = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <View style={styles.cardContainer} testID={`product-item-${id}`}>
      <View style={[styles.categoryStrip, { backgroundColor: badgeColor }]} />

      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.productName} numberOfLines={1}>
            {name}
          </Text>
          <View style={[styles.badge, { backgroundColor: `${badgeColor}18`, borderColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{category}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.calcContainer}>
            <Text style={styles.detailLabel}>Cantidad:</Text>
            <Text style={styles.detailValue}>{numQty}</Text>
            <Text style={styles.separator}>×</Text>
            <Text style={styles.detailLabel}>Unitario:</Text>
            <Text style={styles.detailValue}>{formatCurrency(numPrice)}</Text>
          </View>

          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
          </View>
        </View>

        {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} testID="product-image" /> : null}
        {location ? (
          <Text style={styles.extraText} testID="product-location">
            📍 {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          </Text>
        ) : null}
        {contact ? <Text style={styles.extraText} testID="product-contact">👤 {contact.name}</Text> : null}
        {calendarEventId ? <Text style={styles.extraText} testID="product-calendar">📅 Evento en calendario</Text> : null}
        <View style={styles.footerRow}>
          <TouchableOpacity
            testID="delete-button"
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${name}`}
            style={styles.deleteButton}
            onPress={handleDeletePress}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  categoryStrip: {
    width: 6,
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  calcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginRight: 4,
  },
  separator: {
    fontSize: 13,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  subtotalContainer: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  thumb: { width: '100%', height: 140, borderRadius: 10, marginTop: 8 },
  extraText: { fontSize: 13, color: '#475569', marginTop: 6 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 4,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ProductItem;
