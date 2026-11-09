# Lista de Compras Inteligente - App Móvil

Aplicación móvil desarrollada en **React Native** y **Expo** para la gestión inteligente de listas de compras y cálculo de presupuestos.

---

## Características Principales

1. **Autenticación Local Segura (AsyncStorage)**
   - **Usuario registrado predeterminado**:
     - **Usuario:** `garce`
     - **Contraseña:** `123456`
   - **Registro de nuevos usuarios**: Permite registrar credenciales adicionales o nuevas en el dispositivo bajo `@registered_user`.
   - **Inicio de sesión**: Valida las credenciales ingresadas contra el usuario registrado y almacena la sesión activa en `@user_session`.
   - **Campos limpios y sin autocompletado**: Los formularios de login inician en blanco y cuentan con protección contra autocompletado (`autoComplete="off"`, `textContentType="none"`, `importantForAutofill="no"`) para evitar que el navegador o sistema operativo rellene datos automáticamente.
   - **Persistencia de sesión**: Si el usuario ya inició sesión, ingresa directamente a `HomeScreen`.
   - **Cierre de sesión**: Remueve `@user_session` y redirige al flujo de autenticación (`LoginScreen`).

2. **Gestión de Productos y Presupuesto**
   - **Entidad**: `{ id, name, category, quantity, price, imageUri, location, contact, calendarEventId }`.
   - **Alta de productos (`CreateProductScreen`)**: Formulario con validaciones numéricas y selección por categorías (Verdulería, Almacén, Carnicería, Lácteos, etc.).
   - **Listado interactivo (`HomeScreen`)**: Muestra los productos mediante `FlatList` utilizando el componente reutilizable `ProductItem`.
   - **Cálculo en tiempo real**: Suma el producto `cantidad * precio` de cada elemento y muestra el costo total estimado de la compra.
   - **Eliminación y persistencia**: Botón de eliminación por producto que actualiza la lista y persiste en `@shopping_list`.

3. **Notificaciones Locales (`expo-notifications`)**
   - Solicitud de permisos en el inicio de sesión.
   - Programación de notificación diferida a 5 segundos al agregar un producto:
     > *"¡Recordatorio de compra! No olvides comprar: [Nombre del producto]"*

4. **Testing Automatizado con Jest y React Native Testing Library**
   - Pruebas ejecutables con `npm test` (incluye `productStore.test.js` y `permissions.test.js`):
     - `calculations.test.js`: Verifica el cálculo del costo total acumulado.
     - `CustomButton.test.js`: Verifica el renderizado de texto y eventos de pulsación.
     - `ProductItem.test.js`: Verifica el renderizado de datos y la invocación de `onDelete`.

---

## Estructura del Proyecto

```
/
├── App.js
├── app.json
├── package.json
├── jest.config.js
├── jest.setup.js
└── src/
    ├── components/
    │   ├── CustomButton.js       # Componente reutilizable de botón estilizado
    │   └── ProductItem.js        # Tarjeta reutilizable de producto
    ├── context/
    │   └── AuthContext.js        # Contexto de autenticación desacoplado
    ├── navigation/
    │   └── AppNavigator.js       # React Navigation Native Stack condicional
    ├── screens/
    │   ├── LoginScreen.js        # Pantalla de inicio de sesión
    │   ├── RegisterScreen.js     # Pantalla de registro de usuario
    │   ├── HomeScreen.js         # Lista principal y resumen de total
    │   └── CreateProductScreen.js# Formulario con recordatorio
    ├── store/                    # Zustand: productStore, authStore
    ├── services/
    │   ├── notifications.js      # Configuración de expo-notifications
    │   └── storage.js            # Abstracción de AsyncStorage
    ├── utils/
    │   └── calculations.js       # Lógica matemática y validaciones
    └── __tests__/
        ├── calculations.test.js  # Pruebas de lógica de cálculo
        ├── CustomButton.test.js  # Pruebas del botón reutilizable
        └── ProductItem.test.js   # Pruebas de interacción del ítem de producto
```

---

## Cómo Ejecutar la Aplicación

### Requisitos Previos
- Node.js instalado (v18+)
- Aplicación **Expo Go** instalada en tu dispositivo móvil (Android / iOS) o emulador configurado.

### 1. Iniciar la App
```bash
npm start
# O con Expo CLI:
npx expo start
```
Escanea el código QR desde la app móvil **Expo Go** para abrir la aplicación.

### 2. Ejecutar los Tests
Para correr las pruebas unitarias automatizadas:
```bash
npm test
```
---

## Parcial 2 – Nuevas funcionalidades

- **Permisos** (`src/services/permissions.js`): se consulta/solicita el permiso antes de cada recurso, manejando *concedido / denegado / pendiente*. Si se rechaza, se muestra un mensaje claro con botón "Abrir ajustes".
- **Cámara y galería** (`expo-image-picker`): foto del producto, visible en la lista (`ProductItem`).
- **Ubicación** (`expo-location`): ubicación del comercio (dirección aproximada + coordenadas) asociada al producto.
- **Contactos** (`expo-contacts`): proveedor elegido desde la agenda del dispositivo.
- **Calendario** (`expo-calendar`): evento "Comprar: X" (mañana 10:00) vinculado al producto (`calendarEventId`).
- **Estado global con Zustand** (`src/store/`): `productStore` (load/add/update/remove, persistido en AsyncStorage) y `authStore` (sesión). `HomeScreen`, `CreateProductScreen` y el navegador leen/modifican el estado vía hooks del store.
- **Testing (Jest)**: ahora 13 tests, incluyendo `productStore.test.js` y `permissions.test.js` (con mocks de los módulos nativos).

Modelo de producto: `{ id, name, category, quantity, price, imageUri, location, contact, calendarEventId }`.

### Ejecutar
```bash
npm install
npx expo start      # escanear QR con Expo Go (Android/iOS)
npm test            # correr los tests
```
> Contactos y calendario requieren dispositivo real (no funcionan en web).

**Video DEMO:** _(pegar enlace de YouTube)_
