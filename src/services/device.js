import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import {
  ensureCameraPermission,
  ensureGalleryPermission,
  ensureLocationPermission,
  ensureContactsPermission,
  ensureCalendarPermission,
} from './permissions';

const pickerOptions = { allowsEditing: true, quality: 0.5, aspect: [4, 3] };

export const takePhoto = async () => {
  if (!(await ensureCameraPermission())) return null;
  const res = await ImagePicker.launchCameraAsync(pickerOptions);
  return res.canceled ? null : res.assets[0].uri;
};

export const pickFromGallery = async () => {
  if (!(await ensureGalleryPermission())) return null;
  const res = await ImagePicker.launchImageLibraryAsync({
    ...pickerOptions,
    mediaTypes: ['images'],
  });
  return res.canceled ? null : res.assets[0].uri;
};

export const getCurrentLocation = async () => {
  if (!(await ensureLocationPermission())) return null;
  const pos = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = pos.coords;
  let address = null;
  try {
    const [a] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (a) address = [a.street, a.streetNumber, a.city].filter(Boolean).join(' ');
  } catch (e) {
  }
  return { latitude, longitude, address };
};

export const pickContact = async () => {
  if (!(await ensureContactsPermission())) return null;
  const c = await Contacts.presentContactPickerAsync();
  if (!c) return null;
  return {
    id: c.id,
    name: c.name || [c.firstName, c.lastName].filter(Boolean).join(' '),
    phone: c.phoneNumbers && c.phoneNumbers[0] ? c.phoneNumbers[0].number : null,
  };
};

const getWritableCalendarId = async () => {
  if (Platform.OS === 'ios') {
    const def = await Calendar.getDefaultCalendarAsync();
    return def.id;
  }
  const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const cal = cals.find((c) => c.allowsModifications) || cals[0];
  return cal ? cal.id : null;
};

/** Crea un evento "Comprar X" mañana a las 10:00 (1 hora). Devuelve el id del evento. */
export const createPurchaseEvent = async (productName) => {
  if (!(await ensureCalendarPermission())) return null;
  const calendarId = await getWritableCalendarId();
  if (!calendarId) throw new Error('No hay calendario disponible');
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return Calendar.createEventAsync(calendarId, {
    title: `Comprar: ${productName}`,
    startDate: start,
    endDate: end,
    notes: 'Recordatorio creado desde la app Lista de Compras',
  });
};
