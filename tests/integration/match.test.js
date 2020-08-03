import sinon from 'sinon';

import LocalStorageHandler from '../../src/storage/localStorage';
import KeypairHandler from '../../src/strategy/pgp/keypair';
import PasswordHandler from '../../src/strategy/pgp/password';
import {
    getLocalStorage,
    PAYLOAD,
    PASSWORD,
    PUBLIC_KEY,
    PRIVATE_KEY,
    KEYPAIR_PASSPHRASE,
    ENCRYPTED_WITH_PASSWORD,
    ENCRYPTED_WITH_KEYPAIR,
} from '../mocks';


const PASSWORD_CONTEXT = {
    password: PASSWORD,
    encryptedBlock: ENCRYPTED_WITH_PASSWORD,
};

const KEYPAIR_CONTEXT = {
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
    passphrase: KEYPAIR_PASSPHRASE,
    encryptedBlock: ENCRYPTED_WITH_KEYPAIR,
};

const integrationMatchTest = (getStrategy, getStorage, context) => {
    beforeAll(() => {
        const textEncoding = require('text-encoding-utf-8');
        global.TextEncoder = textEncoding.TextEncoder;

    });

    const strategyName = getStrategy().constructor.name;
    const storageName = getStorage().constructor.name;

    describe(`${storageName} + ${strategyName}`, () => {

        it('Encrypts a string', async () => {
            const strategy =  getStrategy();
            const storage = getStorage(strategy);
            const encrypted = await storage.serialize(context, PAYLOAD);

            expect(encrypted).toMatchSnapshot({
                meta: {
                    datetime: expect.any(Number),
                },
                payload: expect.any(String),
            });

            expect(encrypted.payload).toContain('-----BEGIN PGP MESSAGE-----');
            expect(encrypted.payload).toContain('-----END PGP MESSAGE-----');
        });

        it('Decrypts a string', async () => {
            const strategy = getStrategy();
            const storage = getStorage(strategy);
            const serialized = {
                meta: {
                    serializer: storage.constructor.name,
                    version: storage.constructor.version,
                },
                payload: context.encryptedBlock,
            };

            const decrypted = await storage.deserialize(context, serialized);

            expect(decrypted).toEqual(PAYLOAD);
        });

        it('Encrypts and decrypts the payload', async () => {
            const strategy =  getStrategy();
            const storage = getStorage(strategy);


            await storage.save(context, PAYLOAD);
            const actual = await storage.load(context);

            return expect(PAYLOAD).toEqual(actual);
        });
    });
};


const getPasswordHandler = () => new PasswordHandler();

const getKeypairHandler = () => new KeypairHandler();

const getLocalStorageHandler = (strategy) => {
    const ls = getLocalStorage();
    const lsh = new LocalStorageHandler('lsh', { strategy });
    sinon.stub(lsh, 'ls').get(() => ls);

    return lsh;
};

const strategies = [
    [getPasswordHandler, PASSWORD_CONTEXT],
    [getKeypairHandler, KEYPAIR_CONTEXT],
];

const storages = [
    getLocalStorageHandler,
];

strategies.forEach(([getStrategy, context]) => {
    storages.forEach((getStorage) => {
        integrationMatchTest(getStrategy, getStorage, context);
    });
});
