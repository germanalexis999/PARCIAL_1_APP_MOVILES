import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ProductItem from '../components/ProductItem';
import CustomButton from '../components/CustomButton';
import { getShoppingList, deleteProduct, clearUserSession } from '../services/storage';
import { calculateTotalCost, formatCurrency } from '../utils/calculations';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation, userSession: propSession, onLogout: propLogout }) => {
  const auth = useAuth ? useAuth() : {};
  const userSession = propSession || auth?.userSession;
  const onLogout = propLogout || auth?.signOut;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const storedProducts = await getShoppingList();
      setProducts(storedProducts);
    } catch (error) {
      console.error('Error al cargar productos en HomeScreen:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos de la lista.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleDeleteProduct = (productId) => {
    const itemToDelete = products.find((p) => p.id === productId);
    const itemName = itemToDelete ? `"${itemToDelete.name}"` : 'este producto';

    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que deseas eliminar ${itemName} de tu lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedList = await deleteProduct(productId);
              setProducts(updatedList);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas cerrar tu sesión actual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserSession();
              if (onLogout) {
                onLogout();
              } else if (navigation && navigation.replace) {
                navigation.replace('Login');
              } else if (navigation && navigation.navigate) {
                navigation.navigate('Login');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            }
          },
        },
      ]
    );
  };

  const totalCost = calculateTotalCost(products);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Tu lista de compras está vacía</Text>
      <Text style={styles.emptySubtitle}>
        Presiona el botón de abajo para agregar tu primer producto y calcular tu presupuesto.
      </Text>
      <CustomButton
        title="Agregar Primer Producto"
        onPress={() => navigation.navigate('CreateProduct')}
        variant="primary"
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>Hola,</Text>
          <Text style={styles.usernameText}>
            {userSession?.username || 'Usuario'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          accessibilityLabel="Cerrar sesión"
          accessibilityRole="button"
          testID="logout-button"
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryLabel}>TOTAL ESTIMADO</Text>
          <Text style={styles.summaryAmount} testID="total-cost-display">
            {formatCurrency(totalCost)}
          </Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryBadgeText}>
            {products.length} {products.length === 1 ? 'ítem' : 'ítems'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Productos en la Lista</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateProduct')}
          style={styles.headerAddLink}
        >
          <Text style={styles.headerAddLinkText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onDelete={handleDeleteProduct} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
      />

      {products.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <CustomButton
            title="Agregar Producto"
            onPress={() => navigation.navigate('CreateProduct')}
            variant="primary"
            style={styles.floatingButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoutButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#2563EB',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BFDBFE',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  summaryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  summaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerAddLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerAddLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    width: '100%',
    maxWidth: 240,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    marginVertical: 0,
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default HomeScreen;
