import sinon from 'sinon';

import LocalStorageHandler from '../../../src/storage/localStorage';
import PGPPasswordHandler from '../../../src/strategy/pgp/password';
import { getLocalStorage } from '../../mocks';

const integrationMatchTest = (getStrategy, getStorage) => {
    beforeAll(() => {
        const textEncoding = require('text-encoding-utf-8');
        global.TextEncoder = textEncoding.TextEncoder;

    });

    const strategyName = getStrategy().constructor.name;
    const storageName = getStorage().constructor.name;

    describe(`${storageName} + ${strategyName}`, () => {

        it('Encrypts and decrypts the payload', async () => {
            const strategy =  getStrategy();
            const storage = getStorage(strategy);

            const password = 'My Password';
            const payload = {
                key1: 'value1',
                nested: {
                    key2: 'value2',
                },
            };

            await storage.save({ password }, payload);
            const actual = await storage.load({ password });

            return expect(payload).toEqual(actual);
        });
    });
};


const getPGPPasswordHandler = () => new PGPPasswordHandler();

const getLocalStorageHandler = (strategy) => {
    const ls = getLocalStorage();
    const lsh = new LocalStorageHandler('lsh', { strategy });
    sinon.stub(lsh, 'ls').get(() => ls);

    return lsh;
};

const strategies = [
    getPGPPasswordHandler,
];

const storages = [
    getLocalStorageHandler,
];

strategies.forEach((getStrategy) => {
    storages.forEach((getStorage) => {
        integrationMatchTest(getStrategy, getStorage);
    });
});
