import { getDi, getStorageHandler } from '../../mocks';


export const storageHandlerSuite = (kls) => {

    const payload = {
        key1: 'value1',
        nested: {
            key2: 'value2',
        },
    };

    describe(kls.name, () => {
        describe('.constructor', () => {

            it(`Creates a ${kls.name}`, () => {
                const sh = getStorageHandler(kls);
                expect(sh.constructor.name).toEqual(kls.name);
            });

            it('Stores its key', () => {
                const key = 'storage-handler-key';
                const sh = getStorageHandler(kls, key);
                expect(sh.key).toEqual(key);
            });

            it('Stores the di', () => {
                const sh = getStorageHandler(kls);
                expect(sh.di).not.toEqual(undefined);
                expect(sh.di.strategy).not.toEqual(undefined);
            });
        });
    });

    describe('serialize', () => {

        it('Serializes the payload', async () => {
            const sh = getStorageHandler(kls);
            const serialized = await sh.serialize({}, payload);
            expect(serialized).toMatchSnapshot({
                meta: {
                    datetime: expect.any(Number),
                },
            });
        });
    });

    describe('deserialize', () => {

        [
            {},
            { Meta: {} },
            { meta: { version: kls.version } },
            { meta: { serializer: kls.name } },
            { meta: { serializer: 'a', version: 'z' } },
        ]
            .forEach((badValue) => {
                it('Fails to deserialize a bad value', async () => {
                    const di = getDi(null, () => JSON.stringify(payload));
                    const sh = getStorageHandler(kls, 'key', di);
                    return expect(sh.deserialize({}, badValue)).rejects.toThrow();
                });
            });

        it('Deserializes a good serialized object', async () => {
            const di = getDi(null, () => JSON.stringify(payload));
            const sh = getStorageHandler(kls, 'key', di);

            const goodValue = {
                meta: {
                    serializer: kls.name,
                    version: kls.version,
                },
                payload: 'encrypted',
            };

            const deserialized = await sh.deserialize({}, goodValue);

            expect(deserialized).toEqual(payload);
        });
    });
};
