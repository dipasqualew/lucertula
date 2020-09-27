/**
 * @module Storage/LocalStorageHandler
 */


import { EncryptionContext } from '../strategy/handler';
import { StorageHandler, Serialized } from './handler';


/**
 * LocalStorage Handler
 *
 * @constructor
 */
export class LocalStorageHandler extends StorageHandler {
  static serializer = 'LocalStorageHandler';

  get ls(): Storage {
    return window.localStorage;
  }

  async implSave(_context: EncryptionContext, serialized: Serialized): Promise<void> {
    this.ls.setItem(this.key, JSON.stringify(serialized));
  }

  async implLoad(_context: EncryptionContext): Promise<Serialized | null> {
    const raw = this.ls.getItem(this.key);

    if (raw) {
      return JSON.parse(raw);
    }

    return null;
  }

  async implClear(_context: EncryptionContext): Promise<void> {
    this.ls.removeItem(this.key);
  }

}
