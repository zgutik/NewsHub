
import cloneDeep from 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/cloneDeep.js';

const MAX_STORAGE_SIZE = 5 * 1024 * 1024;
const CACHE_EXPIRATION_MS = 30 * 60 * 1000;
class LocalStorageWrapper {
  
  _getStorageSize() {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (key && value) {
        size += (key.length + value.length) * 2;
      }
    }
    return size;
  }

  
  _freeUpSpace(requiredSpace) {
    while (this._getStorageSize() + requiredSpace > MAX_STORAGE_SIZE) {
      let oldestKey = null;
      let oldestTime = Infinity;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (item && item.timestamp && item.timestamp < oldestTime) {
            oldestTime = item.timestamp;
            oldestKey = key;
          }
        } catch (e) {
        
        }
      }

      if (oldestKey) {
        localStorage.removeItem(oldestKey);
        console.info(`[Storage] Алгоритм очистки: удалена старая запись "${oldestKey}" для освобождения памяти.`);
      } else {
        console.warn(`[Storage] Превышен лимит 5MB, но не найдено подходящих записей для удаления.`);
        break;
      }
    }
  }

  
  set(key, value) {
    try {
      const clonedValue = cloneDeep(value);

      const record = {
        data: clonedValue,
        timestamp: Date.now()
      };

      const recordStr = JSON.stringify(record);
      const requiredSpace = (key.length + recordStr.length) * 2;

      this._freeUpSpace(requiredSpace);

      localStorage.setItem(key, recordStr);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error(`[Storage] Квота превышена: Не удалось сохранить ключ "${key}" даже после алгоритма очистки.`);
      } else {
        console.error(`[Storage] Ошибка при сохранении ключа "${key}":`, e);
      }
    }
  }

  get(key, ignoreExpiration = false) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      if (!item || !item.timestamp) {
        return null;
      }

      const isExpired = (Date.now() - item.timestamp) > CACHE_EXPIRATION_MS;
      if (isExpired && !ignoreExpiration) {
        localStorage.removeItem(key);
        console.info(`[Storage] Запись "${key}" устарела (более 30 минут) и была удалена из кэша.`);
        return null;
      }

      return item.data;
    } catch (e) {
      console.warn(`[Storage] Ошибка парсинга ключа "${key}".`, e);
      return null;
    }
  }

  
  clear() {
    localStorage.clear();
    console.info(`[Storage] Хранилище полностью очищено.`);
  }
}

export const storage = new LocalStorageWrapper();
