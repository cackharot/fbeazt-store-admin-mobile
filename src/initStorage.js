import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export function initStorage() {
    const storage = new Storage({
        size: 1000,
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24 * 5,
        enableCache: true
    });
    global.storage = storage;
}
