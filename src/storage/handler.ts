/**
 * @module Storage
 */

import { StrategyHandler, EncryptionContext } from '../strategy/handler';


export interface Payload {
  [key: string]: unknown;
}

export interface StorageContext {
  [key: string]: unknown;
  strategy: StrategyHandler<EncryptionContext>,
}

export interface Serialized {
  meta: {
    key: string,
    serializer: string,
    version: number,
    datetime: number,
  },
  payload: string,
}

/**
 * Abstract StorageHandler
 * with common utility methods
 * shared between all storage handlers.
 */
export abstract class StorageHandler {

  /**
   * Refers to the version
   * of the storage handler.
   *
   * The handler will refuse to
   * deserialize objects that
   * have been serialized in different
   * storage handler versions.
   */
  static version = 1;

  key: string;
  di: StorageContext;

  /**
   * Creates a StorageHandler
   */
  constructor(key: string, di: StorageContext) {
    this.key = key;
    this.di = di;
  }

  /**
   * Serializes a payload so that
   * it can be saved to the storage.
   */
  async serialize(context: EncryptionContext, payload: Payload): Promise<Serialized> {
    const constructor = this.constructor as typeof StorageHandler;

    const output: Serialized = {
      meta: {
        key: this.key,
        serializer: constructor.name,
        version: constructor.version,
        datetime: Date.now(),
      },
      payload: await this.di.strategy.encrypt(context, JSON.stringify(payload)),
    };

    return output;
  }

  /**
   * Deserializes a serialized and
   * encrypted object, so that it can be
   * loaded into memory.
   *
   * @param {object} context
   * @param {object} serialized
   */
  async deserialize(context: EncryptionContext, serialized: Serialized): Promise<Payload> {
    const constructor = this.constructor as typeof StorageHandler;

    if (!serialized.meta) {
      throw new Error('Invalid serialized data.');
    }

    if (serialized.meta.serializer !== constructor.name) {
      throw new Error(`Invalid serializer: ${serialized.meta.serializer}`);
    }

    if (serialized.meta.version !== constructor.version) {
      throw new Error(`Version mismatch. Data is ${serialized.meta.version}, serializer is ${constructor.version}`);
    }

    const payload = JSON.parse(await this.di.strategy.decrypt(context, serialized.payload));

    return payload;
  }

  /**
   * Serializes and saves to the storage
   * the provided payload.
   *
   * @param {object} context
   * @param {object} payload
   * @returns {object}
   */
  async save(context: EncryptionContext, payload: Payload): Promise<Serialized> {
    const serialized = await this.serialize(context, payload);
    await this.implSave(context, serialized);

    return serialized;
  }

  /**
   * Loads from storage the payload
   * and deserializes it.
   *
   * @param {object} context
   * @returns {object}
   */
  async load(context: EncryptionContext): Promise<Payload | null> {
    const serialized = await this.implLoad(context);

    if (!serialized) {
      return null;
    }

    return await this.deserialize(context, serialized);
  }

  /**
   * Clears the storage
   * deleting any encrypted data.
   *
   * @param {object} context
   */
  async clear(context: EncryptionContext): Promise<void> {
    await this.implClear(context);
  }

  /**
   * Saves the data into the storage.
   * Override this method.
   */
  abstract async implSave(context: EncryptionContext, payload: Serialized): Promise<void>

  /**
   * Loads the data from the storage.
   * Override this method.
   */
  abstract async implLoad(_context: EncryptionContext): Promise<Serialized | null>

  /**
   * Clears the storage
   * deleting any encrypted data.
   */
  abstract async implClear(_context: EncryptionContext): Promise<void>

}

StorageHandler.version = 1;
