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

## Punto Extra: IA Aplicada al Desarrollo

### Herramientas Utilizadas
- **Argon Orchestrator:** planificación de arquitectura, análisis de requerimientos del parcial, diseño de la migración hacia estado global y delegación modular de tareas entre componentes, servicios y pruebas.
- **Hydrogen:** generación asistida, refactorización de pantallas/servicios en React Native + Expo y redacción de pruebas unitarias con Jest y React Native Testing Library.

### Ejemplos de Prompts Aplicados
Los prompts se estructuraron especificando **contexto**, **objetivo técnico** y **restricciones** para obtener código integrable sin romper la base del Parcial 1:

1. **Arquitectura y migración de estado (Argon Orchestrator → Hydrogen):**
   > *"Contexto: App de lista de compras en React Native/Expo con persistencia en `AsyncStorage` y estado local en `HomeScreen` y `AppNavigator`. Objetivo: diseñar e implementar `useProductStore` y `useAuthStore` con Zustand (`loadProducts`, `addProduct`, `updateProduct`, `removeProduct`). Restricciones: mantener compatibilidad con productos previos sin campos opcionales (`imageUri`, `location`, `contact`, `calendarEventId`) y evitar prop drilling."*
2. **Permisos e integración de hardware/APIs nativas:**
   > *"Contexto: Proyecto en Expo SDK 58 ejecutándose en Expo Go. Objetivo: centralizar la verificación y solicitud de permisos (`granted`, `denied`, `undetermined`) en `src/services/permissions.js` y encapsular cámara, galería, ubicación, contactos y calendario en `src/services/device.js`. Restricciones: mostrar alerta clara con acceso a `Linking.openSettings()` al denegar permisos y no bloquear la carga de productos si una acción opcional se cancela."*

### Comparación: Código Generado vs. Código Final Integrado
| Aspecto | Código generado inicialmente | Ajustes integrados en la versión final |
|---|---|---|
| **APIs de Expo SDK 58** | Uso de métodos legacy (`Contacts.presentContactPickerAsync` y `expo-calendar` estándar). | Migración de contactos a la API orientada a clases (`Contacts.Contact.presentPicker()`, `getFullName()`, `getPhones()`) y uso de `expo-calendar/legacy` para mantener compatibilidad real en Expo Go. |
| **Feedback de UI** | Botones simples sin indicador de progreso y texto plano de resultado en `CreateProductScreen.js`. | Se incorporó control de estado `busyAction` (spinner y bloqueo de doble toque durante lecturas de GPS/cámara/contactos) y tarjetas de confirmación visual (`successBox`). |
| **Compatibilidad de sesión** | Reemplazo directo de `AuthContext` que obligaba a modificar la firma de todas las pantallas. | Se conservó `src/context/AuthContext.js` como adaptador liviano conectado a `useAuthStore` para preservar la compatibilidad con tests y pantallas del Parcial 1. |
| **Testing en Jest** | Mocks básicos individuales por librería. | Unificación de mocks nativos en `jest.setup.js` (renombrando a `mockCalendar` por reglas de hoisting de Babel/Jest) y cobertura ampliada a **5 suites / 15 tests**. |

---

## Video DEMO
- **Enlace al video:** https://docs.google.com/videos/d/1zJFys56xW-OtOFpGGC606K7nuzLxP3foOlZrXA2imUo/play?usp=sharing
