# Lista de Compras Inteligente - App Móvil

Aplicación móvil desarrollada en **React Native** y **Expo** para la gestión inteligente de listas de compras y cálculo de presupuestos (Parcial 1 y Parcial 2 – Aplicaciones Móviles).

---

## Características Principales

### 1. Autenticación Local y Estado Global (`Zustand`)
- **Usuario predeterminado:** `garce` / **Contraseña:** `123456`.
- **Registro e inicio de sesión:** Valida credenciales contra `@registered_user` y persiste la sesión activa en `@user_session` (`AsyncStorage`), con campos protegidos contra autocompletado.
- **Estado global (`src/store/`):**
  - `authStore.js`: gestiona `userSession`, `loadingSession`, `signIn`, `signOut`, `restoreSession` y `logout`.
  - `productStore.js`: gestiona `products`, `loading`, `loadProducts`, `addProduct`, `updateProduct` y `removeProduct`, sincronizando con `AsyncStorage`.
  - Las pantallas (`HomeScreen`, `CreateProductScreen`) y `AppNavigator` leen y modifican el estado mediante hooks/selectores de Zustand.

### 2. Gestión de Productos y Presupuesto
- **Entidad:** `{ id, name, category, quantity, price, imageUri, location, contact, calendarEventId }`.
- **Alta de productos (`CreateProductScreen`):** Formulario con validaciones numéricas, selección por categorías y cálculo en tiempo real del total estimado en `HomeScreen`.
- **Listado y eliminación (`ProductItem`):** Tarjetas con foto, ubicación, proveedor, evento vinculado y botón para eliminar productos.

### 3. Permisos y Recursos del Dispositivo
- **Gestión centralizada de permisos (`src/services/permissions.js`):** Consulta y solicita el permiso correspondiente antes de usar cada recurso, manejando estados *concedido*, *denegado* y *pendiente*. Si el usuario rechaza un permiso, muestra una alerta clara con opción directa para **Abrir ajustes** (`Linking.openSettings()`).
- **Cámara y Galería (`expo-image-picker`):** Permite tomar una foto con la cámara o elegir una imagen de la galería para asociarla al producto y mostrarla en la lista.
- **Ubicación GPS (`expo-location`):** Obtiene las coordenadas actuales y dirección aproximada (`reverseGeocodeAsync`) del comercio donde comprar el producto.
- **Contactos (`expo-contacts`):** Permite seleccionar un contacto de la agenda del dispositivo como proveedor del producto.
- **Calendario (`expo-calendar`):** Crea un evento de compra (`"Comprar: <producto>"` para el día siguiente a las 10:00 hs) en el calendario del dispositivo y guarda el `calendarEventId` en el producto.
- **Notificaciones Locales (`expo-notifications`):** Solicita permiso en el login y programa un recordatorio local diferido al guardar un producto.

> **Nota:** Algunas integraciones nativas (como Contactos y Calendario) requieren probarse en un dispositivo físico o emulador nativo; no funcionan en la versión Web.

### 4. Testing Automatizado (`Jest` + React Native Testing Library)
- **5 suites / 15 tests ejecutables con `npm test`** (con mocks de módulos nativos en `jest.setup.js`):
  - `calculations.test.js`: cálculo del costo total y validaciones.
  - `CustomButton.test.js`: renderizado y eventos de pulsación.
  - `ProductItem.test.js`: renderizado de datos del producto e invocación de `onDelete`.
  - `productStore.test.js`: altas, actualizaciones y bajas en el store de Zustand.
  - `permissions.test.js`: manejo de estados concedido, denegado y pendiente con alertas.

---

## Estructura del Proyecto

```text
/
├── App.js
├── app.json                        # Permisos y plugins de Expo
├── package.json
├── jest.config.js
├── jest.setup.js                   # Mocks de AsyncStorage y módulos de Expo
└── src/
    ├── components/
    │   ├── CustomButton.js         # Botón reutilizable
    │   └── ProductItem.js          # Tarjeta de producto (con foto, GPS, contacto y calendario)
    ├── context/
    │   └── AuthContext.js          # Hook adaptador conectado a authStore
    ├── navigation/
    │   └── AppNavigator.js         # Stack condicional conectado a authStore
    ├── screens/
    │   ├── LoginScreen.js          # Inicio de sesión
    │   ├── RegisterScreen.js       # Registro de usuario
    │   ├── HomeScreen.js           # Lista principal y presupuesto total
    │   └── CreateProductScreen.js  # Alta con cámara, galería, GPS, contacto y calendario
    ├── services/
    │   ├── permissions.js          # Solicitud y manejo de permisos del dispositivo
    │   ├── device.js               # Cámara, galería, ubicación, contactos y calendario
    │   ├── notifications.js        # Notificaciones locales con expo-notifications
    │   └── storage.js              # Persistencia en AsyncStorage
    ├── store/
    │   ├── authStore.js            # Estado global de sesión (Zustand)
    │   └── productStore.js         # Estado global de productos (Zustand)
    ├── utils/
    │   └── calculations.js         # Cálculos y validaciones
    └── __tests__/
        ├── calculations.test.js
        ├── CustomButton.test.js
        ├── ProductItem.test.js
        ├── productStore.test.js
        └── permissions.test.js
```

---

## Cómo Ejecutar la Aplicación

### Requisitos Previos
- Node.js instalado (v18+)
- App **Expo Go** instalada en Android / iOS (o emulador configurado)

### 1. Instalar dependencias e iniciar Expo
```bash
npm install
npx expo start
```
Escanea el código QR desde **Expo Go** para abrir la aplicación en tu dispositivo.

### 2. Ejecutar los Tests
```bash
npm test
```

---

## Video DEMO
- **Enlace al video:** https://drive.google.com/file/d/1A68AdnhrkIZ88Mia2nlzrJaw_JKm8-Md/view?usp=drive_link
