import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

// Estados: 'granted' | 'denied' | 'undetermined'
export const normalizeStatus = (res) => {
  if (!res) return 'undetermined';
  if (res.granted || res.status === 'granted') return 'granted';
  if (res.status === 'undetermined') return 'undetermined';
  return 'denied';
};

export const showDeniedAlert = (resource) =>
  Alert.alert(
    'Permiso denegado',
    `Necesitamos acceso a ${resource} para esta función. Puedes habilitarlo desde los ajustes del dispositivo.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
    ]
  );

/**
 * Consulta el permiso; si está pendiente lo solicita; si es rechazado avisa al usuario.
 * Devuelve true solo si fue concedido.
 */
export const ensurePermission = async (getFn, requestFn, resource) => {
  let status = normalizeStatus(await getFn());
  if (status !== 'granted') {
    status = normalizeStatus(await requestFn());
  }
  if (status !== 'granted') {
    showDeniedAlert(resource);
    return false;
  }
  return true;
};

export const ensureCameraPermission = () =>
  ensurePermission(
    ImagePicker.getCameraPermissionsAsync,
    ImagePicker.requestCameraPermissionsAsync,
    'la cámara'
  );
export const ensureGalleryPermission = () =>
  ensurePermission(
    ImagePicker.getMediaLibraryPermissionsAsync,
    ImagePicker.requestMediaLibraryPermissionsAsync,
    'la galería'
  );
export const ensureLocationPermission = () =>
  ensurePermission(
    Location.getForegroundPermissionsAsync,
    Location.requestForegroundPermissionsAsync,
    'la ubicación'
  );
export const ensureContactsPermission = () =>
  ensurePermission(Contacts.getPermissionsAsync, Contacts.requestPermissionsAsync, 'los contactos');
export const ensureCalendarPermission = () =>
  ensurePermission(
    Calendar.getCalendarPermissionsAsync,
    Calendar.requestCalendarPermissionsAsync,
    'el calendario'
  );
