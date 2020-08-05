
/**
 * Abstract StorageHandler
 * with common utility methods
 * shared between all storage handlers.
 */
export default class StorageHandler {

    /**
     * Creates a StorageHandler
     * @param {string} key
     * @param {object} di
     * @param {StrategyHandler} di.strategy
     */
    constructor(key, di) {
        this.key = key;
        this.di = di;
    }

    /**
     * Serializes a payload so that
     * it can be saved to the storage.
     *
     * @param {object} context
     * @param {object} payload
     *
     * @returns {object}
     */
    async serialize(context, payload) {
        const output = {
            meta: {
                key: this.key,
                serializer: this.constructor.name,
                version: this.constructor.version,
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
    async deserialize(context, serialized) {
        if (!serialized.meta) {
            throw new Error('Invalid serialized data.');
        }

        if (serialized.meta.serializer !== this.constructor.name) {
            throw new Error(`Invalid serializer: ${serialized.meta.serialized}`);
        }

        if (serialized.meta.version !== this.constructor.version) {
            throw new Error(`Version mismatch. Data is ${serialized.meta.version}, serializer is ${this.constructor.version}`);
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
    async save(context, payload) {
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
    async load(context) {
        const serialized = await this.implLoad();

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
    async clear(context) {
        return await this.implClear(context);
    }

    /**
     * Saves the data into the storage.
     * Override this method.
     *
     * @param {object} _context
     * @param {object} _data
     */
    async implSave(_context, _data) {
        throw new Error('Not implemented.');
    }

    /**
     * Loads the data from the storage.
     * Override this method.
     *
     * @param {object} _context
     * @returns {object}
     */
    async implLoad(_context) {
        throw new Error('Not implemented.');
    }

    /**
     * Clears the storage
     * deleting any encrypted data.
     *
     * @param {object} context
     */
    async implClear(_context) {
        throw new Error('Not implemented');
    }

}

StorageHandler.version = 1;
