/**
 * @module Storage
 */


import StorageHandler from './handler';

/**
 * LocalStorage Handler
 */
export default class InMemoryHandler extends StorageHandler {

    constructor(key, di) {
        super(key, di);
        this.__storage__ = null;
    }

    /**
     * @inheritdoc
     */
    async implSave(_context, data) {
        this.__storage__ = data;
    }

    /**
     * @inheritdoc
     */
    implLoad() {
        return this.__storage__;
    }

    /**
     * @inheritdoc
     */
    implClear() {
        return this.__storage__ = null;
    }

}
