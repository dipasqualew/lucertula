import { TextDecoder } from 'util';

import crypto from '@trust/webcrypto';
import TextEncoding from 'text-encoding-utf-8';

import { WebCryptoAesGcpHandler } from '../../../../src/strategy/web/aes-gcp';
import { DECRYPTED, PASSWORD, AES_GCP_ENCRYPTED } from '../../../mocks';

describe.only('PasswordHandler', () => {

  const context = {
    password: PASSWORD,
  };

  beforeAll(() => {
    global.TextEncoder = TextEncoding.TextEncoder;
    global.TextDecoder = TextDecoder;
    global.crypto = crypto;
  });

  it('Encrypts a string', async () => {
    const strategy =  new WebCryptoAesGcpHandler();

    const encrypted = await strategy.encrypt(context, DECRYPTED);
    expect(typeof encrypted).toEqual('string');
  });

  it('Decrypts a string', async () => {
    const strategy = new WebCryptoAesGcpHandler();
    const decrypted = await strategy.decrypt(context, AES_GCP_ENCRYPTED);

    expect(decrypted).toEqual(DECRYPTED);
  });

  it('Encrypts and decrypts a string', async () => {
    const strategy = new WebCryptoAesGcpHandler();

    const encrypted = await strategy.encrypt(context, DECRYPTED);
    const decrypted = await strategy.decrypt(context, encrypted);

    expect(decrypted).toEqual(DECRYPTED);
  });
});
