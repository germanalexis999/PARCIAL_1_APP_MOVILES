import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const isExpoGo = (() => {
  try {
    if (Constants?.executionEnvironment === ExecutionEnvironment?.StoreClient) {
      return true;
    }
    if (Constants?.appOwnership === 'expo') {
      return true;
    }
    const expo = require('expo');
    if (typeof expo?.isRunningInExpoGo === 'function' && expo.isRunningInExpoGo()) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
})();

const getNotificationsModule = () => {
  if (isExpoGo || Platform.OS === 'web') {
    return null;
  }
  try {
    return require('expo-notifications');
  } catch (err) {
    return null;
  }
};

try {
  const Notifications = getNotificationsModule();
  if (Notifications && typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {}

export const requestNotificationPermissions = async () => {
  try {
    if (Platform.OS === 'web' || isExpoGo) {
      return true;
    }

    const Notifications = getNotificationsModule();
    if (!Notifications || typeof Notifications.getPermissionsAsync !== 'function') {
      return true;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted' && typeof Notifications.requestPermissionsAsync === 'function') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android' && typeof Notifications.setNotificationChannelAsync === 'function') {
      try {
        await Notifications.setNotificationChannelAsync('shopping-reminders', {
          name: 'Recordatorios de Compras',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2563EB',
          sound: 'default',
        });
      } catch (channelErr) {}
    }

    return true;
  } catch (error) {
    return true;
  }
};

export const schedulePurchaseReminder = async (productName, seconds = 5) => {
  const reminderDelay = Math.max(1, Math.round(seconds));
  const reminderTitle = '¡Recordatorio de compra!';
  const reminderBody = `¡Recordatorio de compra! No olvides comprar: ${productName}`;

  try {
    if (isExpoGo || Platform.OS === 'web') {
      setTimeout(() => {
        Alert.alert(
          reminderTitle,
          reminderBody,
          [{ text: '¡Entendido!', style: 'default' }]
        );
      }, reminderDelay * 1000);
      return `timer-${Date.now()}`;
    }

    const Notifications = getNotificationsModule();
    if (Notifications && typeof Notifications.scheduleNotificationAsync === 'function') {
      await requestNotificationPermissions();
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminderTitle,
          body: reminderBody,
          data: { productName, scheduledAt: new Date().toISOString() },
          sound: true,
          channelId: Platform.OS === 'android' ? 'shopping-reminders' : undefined,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL || 'timeInterval',
          seconds: reminderDelay,
        },
      });

      return notificationId;
    }

    setTimeout(() => {
      Alert.alert(
        reminderTitle,
        reminderBody,
        [{ text: '¡Entendido!', style: 'default' }]
      );
    }, reminderDelay * 1000);
    return `fallback-${Date.now()}`;
  } catch (error) {
    setTimeout(() => {
      Alert.alert(
        reminderTitle,
        reminderBody,
        [{ text: '¡Entendido!', style: 'default' }]
      );
    }, reminderDelay * 1000);
    return `fallback-${Date.now()}`;
  }
};

export const cancelNotification = async (notificationId) => {
  try {
    const Notifications = getNotificationsModule();
    if (notificationId && Notifications && typeof Notifications.cancelScheduledNotificationAsync === 'function') {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  } catch (error) {
    console.error('Error al cancelar notificación:', error);
  }
};
