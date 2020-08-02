import sinon from 'sinon';


/**
 * Generates a dependency injector
 *
 * @param {function?} encrypt
 * @param {function?} decrypt
 * @returns {object}
 */
export const getDi = (encrypt = null, decrypt = null) => {

    if (!encrypt) {
        encrypt = sinon.fake.resolves('encrypted');
    }

    if (!decrypt) {
        decrypt = sinon.fake.resolves('decrypted');
    }

    return {
        strategy: {
            encrypt,
            decrypt,
        },
    };
};

export const getStorageHandler = (kls, key = 'StorageHandlerKey', di = null) => {
    if (!di) {
        di = getDi();
    }

    return new kls(key, di);
};

export const getLocalStorage = () => {
    const ls = { __data__: {} };
    ls.getItem = (key) => ls.__data__[key];
    ls.setItem = (key, value) => (ls.__data__[key] = value);

    return ls;
};
