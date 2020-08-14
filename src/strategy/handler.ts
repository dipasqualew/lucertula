/**
 * @module Strategy
 */


export interface EncryptionContext {
    [key: string]: unknown;
}


/**
 * Strategy Handler base class.
 *
 * @constructor
 */
export class StrategyHandler<EC extends EncryptionContext> {

  encrypt(_context: EC, _plaintext: string): Promise<string> {
    throw new Error('Not implemented error.');
  }

  decrypt(_context: EC, _encrypted: string): Promise<string> {
    throw new Error('Not implemented error.');
  }
}
