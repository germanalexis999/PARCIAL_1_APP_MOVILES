import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { ensureLocationPermission, normalizeStatus } from '../services/permissions';
import { getCurrentLocation } from '../services/device';

describe('permisos', () => {
  beforeEach(() => jest.spyOn(Alert, 'alert').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('normaliza estados de permiso', () => {
    expect(normalizeStatus({ status: 'granted' })).toBe('granted');
    expect(normalizeStatus({ status: 'denied' })).toBe('denied');
    expect(normalizeStatus({ status: 'undetermined' })).toBe('undetermined');
  });

  it('permiso concedido devuelve ubicación', async () => {
    const loc = await getCurrentLocation();
    expect(loc.latitude).toBe(-34.6);
    expect(loc.address).toContain('Corrientes');
  });

  it('permiso denegado muestra mensaje y no obtiene ubicación', async () => {
    Location.getForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
    expect(await ensureLocationPermission()).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Permiso denegado', expect.any(String), expect.any(Array));
  });
});
