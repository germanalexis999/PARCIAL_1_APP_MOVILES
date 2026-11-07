import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateProductScreen from '../screens/CreateProductScreen';
import { useAuthStore } from '../store/authStore';

import { useAuth } from '../context/AuthContext';
export { useAuth };

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const userSession = useAuthStore((s) => s.userSession);
  const loadingSession = useAuthStore((s) => s.loadingSession);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);
  if (loadingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F8FAFC',
            },
            headerTintColor: '#0F172A',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}
        >
          {userSession ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="CreateProduct"
                component={CreateProductScreen}
                options={{
                  title: 'Agregar Producto',
                  headerBackTitle: 'Volver',
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  title: 'Registro de Usuario',
                  headerBackTitle: 'Login',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default AppNavigator;
