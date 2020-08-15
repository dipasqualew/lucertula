/**
 * @module Strategy
 */


import {
  message,
  decrypt,
  encrypt,
  key,
  DecryptOptions,
  EncryptOptions,
} from 'openpgp';

import { StrategyHandler, EncryptionContext } from '../handler';

interface KeypairEncryptionContext extends EncryptionContext {
    publicKey: string,
    privateKey: string,
    passphrase: string,
}

interface DecryptedKeypair {
    publicKeys: key.Key[];
    privateKeys: key.Key[];
}

/**
 * PGP KeypairHandler Handler
 */
export class KeypairHandler extends StrategyHandler<KeypairEncryptionContext> {

  /**
     * Read and decrypts
     * public and private keys
     */
  async readKeys(context: KeypairEncryptionContext): Promise<DecryptedKeypair> {
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
     */
  async encrypt(context: KeypairEncryptionContext, plaintext: string): Promise<string> {
    const { publicKeys, privateKeys } = await this.readKeys(context);

    const options: EncryptOptions = {
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
     */
  async decrypt(context: KeypairEncryptionContext, encrypted: string): Promise<string> {
    const { publicKeys, privateKeys } = await this.readKeys(context);

    const options: DecryptOptions = {
      message: await message.readArmored(encrypted),
      publicKeys,
      privateKeys,
    };

    const output = await decrypt(options);

    return output.data;
  }
}
