/**
 * Inspired by Chris Veness (MIT Licence). See:
 * https://gist.github.com/chrisveness/43bcda93af9f646d083fad678071b90a
 */

import { StrategyHandler, EncryptionContext } from '../handler';

/**
 * WebCryptoAesGcp Context
 */
export interface WebCryptoAesGcpContext extends EncryptionContext {
  password: string;
}

/**
 * Defines a WebCrypto Algorithm
 */
export interface WebCryptoAlgorithm {
  iv: Uint8Array,
  name: string
}

/**
 * Valid key usages
 */
export enum KeyUsages {
  ENCRYPT = 'encrypt',
  DECRYPT = 'decrypt',
}


/**
 * PGP KeypairHandler Handler
 */
export class WebCryptoAesGcpHandler extends StrategyHandler<WebCryptoAesGcpContext> {

  /**
   * Name of the algorithm
   */
  static algorithmName = 'AES-GCM';

  /**
   * Returns a Crypto instance.
   * This is corresponds to window.crypto
   * in the browser and to a mock library in nodejs
   */
  get crypto(): Crypto {
    return crypto;
  }

  /**
   * Returns an IV
   */
  getIV(): Uint8Array {
    return this.crypto.getRandomValues(new Uint8Array(12));
  }

  /**
   * Generates the algorithm type
   * to be used in the encrpytion method.
   *
   * If `iv` is not passed
   * a new `iv` is generated
   *
   * @param iv?
   */
  getAlgorithm(iv?: Uint8Array): WebCryptoAlgorithm {
    const algorithm = {
      iv: iv || this.getIV(),
      name: (this.constructor as typeof WebCryptoAesGcpHandler).algorithmName,
    };

    return algorithm;
  }

  /**
   * Returns an encryption key
   *
   * @param algorithm
   * @param password
   * @param usages
   */
  async getKey(algorithm: WebCryptoAlgorithm, password: string, usages: KeyUsages[]): Promise<CryptoKey> {
    const encoded = this.encoder.encode(password);
    const hashed = await crypto.subtle.digest({ name: 'SHA-256' }, encoded);

    const key = await this.crypto.subtle.importKey('raw', hashed, algorithm, false, usages);

    return key;
  }

  /**
   * Encrypts plaintext using AES-GCM
   * with the supplied password
   */
  async encrypt(context: WebCryptoAesGcpContext, plaintext: string): Promise<string> {
    const alg = this.getAlgorithm();
    const key = await this.getKey(alg, context.password, [KeyUsages.ENCRYPT]);

    // encode plaintext as UTF-8
    const encoded = this.encoder.encode(plaintext);

    // encrypt plaintext using key
    const buffer = await crypto.subtle.encrypt(alg, key, encoded);

    // transform as byte array
    const bytes = Array.from(new Uint8Array(buffer));

    // encode in base64
    const encryptedb64 = btoa(bytes.map(byte => String.fromCharCode(byte)).join(''));

    // Generate ivHex
    const ivHex = Array.from(alg.iv).map(b => ('00' + b.toString(16)).slice(-2)).join('');

    // Final result of the encryption
    const encrypted = ivHex + encryptedb64;

    return encrypted;
  }

  /**
   * Decrypts an encrypted string using AES-GCM
   * with the supplied password
   *
   * @param context
   * @param encrypted
   */
  async decrypt(context: WebCryptoAesGcpContext, encrypted: string): Promise<string> {
    const ivSlice = encrypted.slice(0, 24).match(/.{2}/g);

    if (!ivSlice) {
      throw new Error('Could not extract IV from encrypted string');
    }

    const iv =  new Uint8Array(ivSlice.map((byte) => parseInt(byte, 16)));

    const alg = this.getAlgorithm(iv);
    const key = await this.getKey(alg, context.password, [KeyUsages.DECRYPT]);

    const decoded = atob(encrypted.slice(24)).match(/[\s\S]/g);

    if (!decoded) {
      throw new Error('Could not decode encrypted string');
    }

    // ciphertext as Uint8Array
    // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?
    const bytes = new Uint8Array(decoded.map((char) => char.charCodeAt(0)));

    // decrypt ciphertext using key
    const buffer = await this.crypto.subtle.decrypt(alg, key, bytes);

    // decode password from UTF-8
    const decrypted = this.decoder.decode(buffer);

    return decrypted;
  }
}
