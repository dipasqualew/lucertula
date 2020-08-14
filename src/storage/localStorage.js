/**
 * @module Storage
 */


import StorageHandler from './handler';

/**
 * LocalStorage Handler
 */
export default class LocalStorageHandler extends StorageHandler {

    /**
     * Returns the LocalStorage instance.
     *
     * @returns {WindowLocalStorage}
     */
    get ls() {
        return this.di.localStorage;
    }

    /**
     * @inheritdoc
     */
    async implSave(context, data) {
        this.ls.setItem(this.key, JSON.stringify(data));
    }

    /**
     * @inheritdoc
     */
    implLoad() {
        return JSON.parse(this.ls.getItem(this.key));
    }

    /**
     * @inheritdoc
     */
    async implClear() {
        this.ls.removeItem(this.key);
    }

}
