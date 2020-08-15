import TextEncoding from 'text-encoding-utf-8';

import { PasswordHandler } from '../../../../src/strategy/pgp/password';
import {
  PAYLOAD,
  PASSWORD,
  ENCRYPTED_WITH_PASSWORD,
} from '../../../mocks';

describe('PasswordHandler', () => {

  const context = {
    password: PASSWORD,
  };

  beforeAll(() => {
    global.TextEncoder = TextEncoding.TextEncoder;
  });

  it('Encrypts a string', async () => {
    const strategy =  new PasswordHandler();
    const encrypted = await strategy.encrypt(context, 'Hello World');

    expect(encrypted).toContain('-----BEGIN PGP MESSAGE-----');
    expect(encrypted).toContain('-----END PGP MESSAGE-----');
  });

  it('Decrypts a string', async () => {
    const strategy = new PasswordHandler();
    const decrypted = await strategy.decrypt(context, ENCRYPTED_WITH_PASSWORD);

    expect(decrypted).toEqual(JSON.stringify(PAYLOAD));
  });

  it('Encrypts and decrypts a string', async () => {
    const strategy = new PasswordHandler();
    const plaintext = 'Some plaintext string';
    const password = 'Somepassword';

    const encrypted = await strategy.encrypt({ password }, plaintext);
    const decrypted = await strategy.decrypt({ password }, encrypted);

    expect(decrypted).toEqual(plaintext);
  });
});
