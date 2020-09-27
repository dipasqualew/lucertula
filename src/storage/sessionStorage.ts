/**
 * @module Storage/SessionStorageHandler
 */


import { EncryptionContext } from '../strategy/handler';
import { StorageHandler, Serialized } from './handler';

/**
 * SessionStorage Handler
 */
export class SessionStorageHandler extends StorageHandler {

  static serializer = 'SessionStorageHandler';

  /**
     * Returns the SessionStorage instance.
     */
  get ss(): Storage {
    return window.sessionStorage;
  }

  async implSave(_context: EncryptionContext, serialized: Serialized): Promise<void> {
    const raw = JSON.stringify(serialized);
    this.ss.setItem(this.key, raw);
  }

  async implLoad(_context: EncryptionContext): Promise<Serialized | null> {
    const raw = this.ss.getItem(this.key);

    if (raw) {
      return JSON.parse(raw);
    }

    return null;
  }

  async implClear(_context: EncryptionContext): Promise<void> {
    this.ss.removeItem(this.key);
  }

}
