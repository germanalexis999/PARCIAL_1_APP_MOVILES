# Plan Parcial 2 – Lista de Compras (React Native + Expo)

Rama: `feature/parcial-2` · Entrega: 17/11/2026 · Base: app del Parcial 1 (`{ id, name, category, quantity, price }`, AsyncStorage, AuthContext, notificaciones, 3 tests Jest).

## Mapeo a la Lista de compras
| Requisito | Aplicación |
|---|---|
| Cámara/Galería | Foto del producto (`imageUri`) |
| Ubicación | Comercio donde comprarlo (`location {lat, lng, address}`) |
| Contactos | Proveedor (`contact {id, name, phone}`) |
| Calendario | Recordatorio de compra vinculado (`calendarEventId`) |
| Estado global | Zustand: `useProductStore` (+ `useAuthStore`) |

Nuevo modelo: `{ id, name, category, quantity, price, imageUri?, location?, contact?, calendarEventId? }` (campos nuevos opcionales → compatible con datos del Parcial 1).

## Fases (≈2 semanas)

### Fase 0 – Preparación (día 1)
- [ ] Instalar: `npx expo install expo-image-picker expo-camera expo-location expo-contacts expo-calendar` y `npm i zustand`.
- [ ] `app.json`: plugins y textos de permisos (iOS `infoPlist`, Android `permissions`: CAMERA, ACCESS_FINE_LOCATION, READ_CONTACTS, READ/WRITE_CALENDAR).
- [ ] Mocks de los módulos nativos en `jest.setup.js`.

### Fase 1 – Estado global con Zustand (días 2-3)
- [ ] `src/store/productStore.js`: `products`, `loading`, acciones `loadProducts`, `addProduct`, `updateProduct`, `removeProduct`; persiste vía `services/storage.js` (o middleware `persist` con AsyncStorage).
- [ ] `src/store/authStore.js`: reemplaza `AuthContext` (`userSession`, `signIn`, `signOut`).
- [ ] Refactor `HomeScreen`, `CreateProductScreen`, `LoginScreen`, `RegisterScreen`, `AppNavigator`: usar selectores (`useProductStore(s => s.products)`), eliminar `useState` de lista y props de sesión.
- [ ] Tests del store.

### Fase 2 – Permisos (día 4)
- [ ] `src/services/permissions.js`: helper genérico `ensurePermission(tipo)` → `granted | denied | undetermined`, usando `get*PermissionsAsync` / `request*PermissionsAsync`.
- [ ] Hook `usePermission` + `Alert` claro con botón "Abrir ajustes" (`Linking.openSettings()`) si se deniega.

### Fase 3 – Cámara y galería (días 5-6)
- [ ] `src/services/media.js`: `takePhoto()` / `pickImage()` con `expo-image-picker` (`expo-camera` opcional).
- [ ] `CreateProductScreen`: selector "Tomar foto / Elegir de galería" + preview.
- [ ] `ProductItem`: miniatura en la lista; imagen grande en detalle.

### Fase 4 – Ubicación (día 7)
- [ ] `src/services/location.js`: `getCurrentLocation()` + `reverseGeocodeAsync` para dirección aproximada.
- [ ] Botón "Usar mi ubicación (comercio)"; mostrar dirección/coordenadas en item y detalle (opcional: link a Google Maps con `Linking`).

### Fase 5 – Contactos y calendario (días 8-9)
- [ ] `expo-contacts`: `presentContactPickerAsync` o lista con `getContactsAsync`; guardar proveedor en el producto.
- [ ] `expo-calendar`: obtener calendario por defecto, `createEventAsync` con fecha elegida; guardar `calendarEventId`; manejar permisos y plataforma.
- [ ] Pantalla `ProductDetailScreen` (foto, ubicación, contacto, evento) y navegación desde la lista.

### Fase 6 – Testing (día 10)
Mantener los 3 tests existentes y añadir (mínimo):
- [ ] `productStore.test.js`: agregar / actualizar / eliminar.
- [ ] `permissions.test.js`: estados granted / denied (con mocks).
- [ ] Render de `ProductItem` con imagen/ubicación/contacto.
- [ ] Verificar `npm test` en verde.

### Fase 7 – Extra IA (opcional, día 11)
- [ ] Documentar en README: herramientas usadas, prompts (contexto, ejemplos, restricciones) y comparación código generado vs. final. Opcional: pantalla de detalle desde Figma → RN.

### Fase 8 – Entrega (días 12-14)
- [ ] Probar en dispositivo real (Expo Go o APK con `eas build -p android --profile preview`).
- [ ] README: nuevas funcionalidades, cómo ejecutar y correr tests, link al video.
- [ ] Video demo ≤ 1 min en YouTube (permisos → foto → ubicación → contacto → calendario → store).
- [ ] Merge a `main`, repo público, enviar enlace a martin.cornejo@istea.com.ar.

## Estructura final propuesta
```
src/
  store/        productStore.js, authStore.js
  services/     permissions.js, media.js, location.js, contacts.js, calendar.js, storage.js, notifications.js
  components/   CustomButton, ProductItem, PermissionNotice, ImagePickerField, LocationField, ContactField
  screens/      Login, Register, Home, CreateProduct, ProductDetail
  __tests__/    calculations, CustomButton, ProductItem, productStore, permissions
```

## Riesgos
- `expo-calendar` / `expo-contacts` no funcionan en web ni del todo en Expo Go según SDK → probar con dev build/APK temprano.
- Mockear bien módulos nativos en Jest.
- Datos del Parcial 1 sin campos nuevos: tratarlos como opcionales.
