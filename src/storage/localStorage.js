
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
        return this.context.localStorage;
    }

    /**
     * @inheritdoc
     */
    async implSave(context, data) {
        this.ls.setItem(this.key, data);
    }

    /**
     * @inheritdoc
     */
    implLoad() {
        return this.ls.getItem(this.key);
    }

}
