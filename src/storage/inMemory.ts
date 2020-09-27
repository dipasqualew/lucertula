/**
 * @module Storage/InMemoryHandler
 */

import { EncryptionContext } from '../strategy/handler';
import {
  StorageHandler,
  StorageContext,
  Serialized,
} from './handler';


/**
 * In Memory Handler
 */
export class InMemoryHandler extends StorageHandler {

  STORAGE: Serialized | null;
  static serializer = 'InMemoryHandler';

  constructor(key: string, di: StorageContext) {
    super(key, di);
    this.STORAGE = null;
  }

  async implSave(_context: EncryptionContext, serialized: Serialized): Promise<void> {
    this.STORAGE = serialized;
  }

  async implLoad(_context: EncryptionContext): Promise<Serialized | null> {
    return this.STORAGE;
  }

  async implClear(_context: EncryptionContext): Promise<void> {
    this.STORAGE = null;
  }

}
