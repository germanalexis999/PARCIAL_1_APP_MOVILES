// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  SchedulableTriggerInputTypes: {
    TIME_INTERVAL: 'timeInterval',
  },
}));

jest.mock('expo-image-picker', () => ({
  getCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  getMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: 'file://gallery.jpg' }] })),
}));
jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: -34.6, longitude: -58.4 } })),
  reverseGeocodeAsync: jest.fn(() => Promise.resolve([{ street: 'Corrientes', streetNumber: '123', city: 'CABA' }])),
}));
jest.mock('expo-contacts', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  presentContactPickerAsync: jest.fn(() => Promise.resolve({ id: '1', name: 'Juan Perez', phoneNumbers: [{ number: '1122334455' }] })),
}));
jest.mock('expo-calendar', () => ({
  getCalendarPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  requestCalendarPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted', granted: true })),
  getDefaultCalendarAsync: jest.fn(() => Promise.resolve({ id: 'cal1' })),
  getCalendarsAsync: jest.fn(() => Promise.resolve([{ id: 'cal1', allowsModifications: true }])),
  createEventAsync: jest.fn(() => Promise.resolve('event-1')),
  EntityTypes: { EVENT: 'event' },
}));
