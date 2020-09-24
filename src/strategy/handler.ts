/**
 * @module Strategy
 */


/**
 * Generic encryption context
 * to be used by encryption methods
 */
export interface EncryptionContext {
  [key: string]: unknown;
}


/**
 * Strategy Handler base class.
 *
 * @constructor
 */
export abstract class StrategyHandler<StrategyEncryptionContext extends EncryptionContext> {

  /**
   * Returns a TextEncoder
   */
  get encoder(): TextEncoder {
    return new TextEncoder();
  }

  /**
   * Returns a TextDecoder
   */
  get decoder(): TextDecoder {
    return new TextDecoder();
  }

  /**
   * Encrypts a string
   *
   * @param context
   * @param plaintext
   */
  abstract async encrypt(context: StrategyEncryptionContext, plaintext: string): Promise<string>

  /**
   * Decrypts a string
   *
   * @param context
   * @param encrypted
   */
  abstract async decrypt(context: StrategyEncryptionContext, encrypted: string): Promise<string>
}
