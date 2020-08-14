import TextEncoding from 'text-encoding-utf-8';

import { KeypairHandler } from '../../../../src/strategy/pgp/keypair';
import {
  PAYLOAD,
  PUBLIC_KEY,
  PRIVATE_KEY,
  KEYPAIR_PASSPHRASE,
  ENCRYPTED_WITH_KEYPAIR,
} from '../../../mocks';

describe('KeypairHandler', () => {

  const context = {
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
    passphrase: KEYPAIR_PASSPHRASE,
  };

  beforeAll(() => {
    global.TextEncoder = TextEncoding.TextEncoder;
  });

  it('Encrypts a string', async () => {
    const strategy =  new KeypairHandler();
    const encrypted = await strategy.encrypt(context, 'Hello World');

    expect(encrypted).toContain('-----BEGIN PGP MESSAGE-----');
    expect(encrypted).toContain('-----END PGP MESSAGE-----');
  });

  it('Decrypts a string', async () => {
    const strategy = new KeypairHandler();
    const decrypted = await strategy.decrypt(context, ENCRYPTED_WITH_KEYPAIR);

    expect(decrypted).toEqual(JSON.stringify(PAYLOAD));
  });

  it('Encrypts and decrypts a string', async () => {
    const strategy = new KeypairHandler();
    const plaintext = 'Some plaintext string';

    const encrypted = await strategy.encrypt(context, plaintext);
    const decrypted = await strategy.decrypt(context, encrypted);

    expect(decrypted).toEqual(plaintext);
  });
});
