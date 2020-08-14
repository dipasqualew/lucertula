/**
 * @module Strategy
 */


import { message, decrypt, encrypt, key } from 'openpgp';

import StrategyHandler from '../handler';

/**
 * PGP KeypairHandler Handler
 *
 * @constructor
 */
export default class KeypairHandler extends StrategyHandler {

    /**
     * Read and decrypts
     * public and private keys
     *
     * @param {object} context
     * @param {string} context.publicKey
     * @param {string} context.privateKey
     *
     * @returns {object}
     */
    async readKeys(context) {
        const [{ keys: publicKeys }, { keys: privateKeys }] = await Promise.all([
            key.readArmored(context.publicKey),
            key.readArmored(context.privateKey),
        ]);

        await Promise.all(privateKeys.map((pk) => pk.decrypt(context.passphrase)));

        return {
            publicKeys,
            privateKeys,
        };
    }

    /**
     * Encrypts a string with the given password.
     *
     * @param {object} context
     * @param {string} context.password
     * @param {string} plaintext
     * @returns {string}
     */
    async encrypt(context, plaintext) {
        const { publicKeys, privateKeys } = await this.readKeys(context);

        const options = {
            message: message.fromText(plaintext),
            publicKeys,
            privateKeys,
            armor: true,
        };

        const output = await encrypt(options);

        return output.data;
    }

    /**
     * Decrypts a string with the given password.
     *
     * @param {object} context
     * @param {string} context.password
     * @param {string} encrypted
     * @returns {string}
     */
    async decrypt(context, encrypted) {
        const { publicKeys, privateKeys } = await this.readKeys(context);

        const options = {
            message: await message.readArmored(encrypted),
            publicKeys,
            privateKeys,
        };

        const output = await decrypt(options);

        return output.data;
    }
}
