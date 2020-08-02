import PGPPasswordHandler from '../../../../src/strategy/pgp/password';


describe('PGPPasswordHandler', () => {

    beforeAll(() => {
        const textEncoding = require('text-encoding-utf-8');
        global.TextEncoder = textEncoding.TextEncoder;

    });

    it('Encrypts and decrypts a string', async () => {
        const handler = new PGPPasswordHandler();
        const plaintext = 'Some plaintext string';
        const password = 'Somepassword';

        const encrypted = await handler.encrypt({ password }, plaintext);
        const decrypted = await handler.decrypt({ password }, encrypted);

        expect(decrypted).toEqual(plaintext);
    });
});
