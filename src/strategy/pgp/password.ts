/**
 * @module Strategy
 */


import {
  message,
  decrypt,
  encrypt,
  DecryptOptions,
  EncryptOptions,
} from 'openpgp';

import { StrategyHandler, EncryptionContext } from '../handler';

export interface PasswordEncryptionContext extends EncryptionContext {
    password: string;
}

/**
 * PGP Password Handler
 *
 * @constructor
 */
export class PasswordHandler extends StrategyHandler<PasswordEncryptionContext> {

  /**
   * Encrypts a string with the given password.
   */
  async encrypt(context: PasswordEncryptionContext, plaintext: string): Promise<string> {
    const options: EncryptOptions = {
      message: message.fromText(plaintext),
      passwords: [context.password],
      armor: true,
    };

    const output = await encrypt(options);
    return output.data;
  }

  /**
   * Decrypts a string with the given password.
   */
  async decrypt(context: PasswordEncryptionContext, encrypted: string): Promise<string> {
    const options: DecryptOptions = {
      message: await message.readArmored(encrypted),
      passwords: [context.password],
      format: 'utf8',
    };

    const output = await decrypt(options);
    return output.data;
  }
}
