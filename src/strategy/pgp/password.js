/**
 * @module Strategy
 */


import { message, decrypt, encrypt } from 'openpgp';

import StrategyHandler from '../handler';

/**
 * PGP Password Handler
 *
 * @constructor
 */
export default class PasswordHandler extends StrategyHandler {
    /**
     * Encrypts a string with the given password.
     *
     * @param {object} context
     * @param {string} context.password
     * @param {string} plaintext
     * @returns {string}
     */
    async encrypt(context, plaintext) {
        const options = {
            message: message.fromText(plaintext),
            passwords: [context.password],
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
        const options = {
            message: await message.readArmored(encrypted),
            passwords: [context.password],
            format: 'utf8',
        };

        const output = await decrypt(options);
        return output.data;
    }
}
