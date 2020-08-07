
import StorageHandler from './handler';

/**
 * SessionStorage Handler
 */
export default class SessionStorageHandler extends StorageHandler {

    /**
     * Returns the SessionStorage instance.
     *
     * @returns {WindowSessionStorage}
     */
    get ss() {
        return this.context.sessionStorage;
    }

    /**
     * @inheritdoc
     */
    async implSave(context, data) {
        this.ss.setItem(this.key, JSON.stringify(data));
    }

    /**
     * @inheritdoc
     */
    implLoad() {
        return JSON.parse(this.ss.getItem(this.key));
    }

}
