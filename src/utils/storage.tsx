import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin AsyncStorage helper that JSON-encodes objects.
 */
export const storage = {
  async get(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw == null) {
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch {
      return null;
    }
  },

  async set(key, value) {
    try {
      const raw =
        typeof value === 'string' ? value : JSON.stringify(value ?? null);
      await AsyncStorage.setItem(key, raw);
      return true;
    } catch {
      return false;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

export default storage;
