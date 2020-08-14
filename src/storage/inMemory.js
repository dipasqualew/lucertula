/**
 * @module Storage/InMemoryHandler
 */


import StorageHandler from './handler';

/**
 * In Memory Handler
 *
 * @constructor
 * @extends Storage:StorageHandler
 */
export default class InMemoryHandler extends StorageHandler {

    constructor(key, di) {
        super(key, di);
        this.__storage__ = null;
    }

    /** @inheritdoc */
    async implSave(_context, data) {
        this.__storage__ = data;
    }

    /**
     * @override
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
