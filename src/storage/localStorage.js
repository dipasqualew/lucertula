
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
     * TODO: Doesn't handle circular data
     */
    async implSave(context, data) {
        this.ls.setItem(this.key, JSON.stringify(data));
    }

    /**
     * @inheritdoc
     * TODO: Doesn't handle circular data
     */
    implLoad() {
        return JSON.parse(this.ls.getItem(this.key));
    }

}
