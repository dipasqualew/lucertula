import sinon from 'sinon';

import TextEncoding from 'text-encoding-utf-8';

import { InMemoryHandler } from '../../src/storage/inMemory';
import { LocalStorageHandler } from '../../src/storage/localStorage';
import { SessionStorageHandler } from '../../src/storage/sessionStorage';
import { KeypairHandler } from '../../src/strategy/pgp/keypair';
import { PasswordHandler } from '../../src/strategy/pgp/password';
import {
  getLocalStorage,
  getSessionStorage,
  PAYLOAD,
  PASSWORD,
  PUBLIC_KEY,
  PRIVATE_KEY,
  KEYPAIR_PASSPHRASE,
  ENCRYPTED_WITH_PASSWORD,
  ENCRYPTED_WITH_KEYPAIR,
} from '../mocks';


/**
 * Context to be passed
 * to password-based strategies.
 *
 * @const {object}
 */
const PASSWORD_CONTEXT = {
  password: PASSWORD,
  encryptedBlock: ENCRYPTED_WITH_PASSWORD,
};

/**
 * Context to be passed
 * to keypair-based strategies.
 *
 * @const {object}
 */
const KEYPAIR_CONTEXT = {
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  passphrase: KEYPAIR_PASSPHRASE,
  encryptedBlock: ENCRYPTED_WITH_KEYPAIR,
};

/**
 * Runs the integration tests
 * for a combination of strategy and storage.
 *
 * @param {Function} getStrategy
 * @param {Function} getStorage
 * @param {object} context
 */
const integrationMatchTest = (getStrategy, getStorage, context) => {
  beforeAll(() => {
    global.TextEncoder = TextEncoding.TextEncoder;

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

    it('Clears the storage', async () => {
      const strategy = getStrategy();
      const storage = getStorage(strategy);

      await storage.save(context, PAYLOAD);
      await storage.clear();

      const decrypted = await storage.load(context);

      expect(decrypted).toEqual(null);
    });
  });
};

/**
 * Returns a configured PasswordHandler.
 *
 * @returns {PasswordHandler}
 */
const getPasswordHandler = () => new PasswordHandler();

/**
 * Returns a configured KeypairHandler.
 *
 * @returns {KeypairHandler}
 */
const getKeypairHandler = () => new KeypairHandler();

/**
 * Returns a configured LocalStorageHandler.
 *
 * @param {StrategyHandler} strategy
 * @returns {LocalStorageHandler}
 */
const getLocalStorageHandler = (strategy) => {
  const ls = getLocalStorage();
  const lsh = new LocalStorageHandler('lsh', { strategy });
  sinon.stub(lsh, 'ls').get(() => ls);

  return lsh;
};

/**
 * Returns a configured SessionStorageHandler.
 *
 * @param {StrategyHandler} strategy
 * @returns {SessionStorageHandler}
 */
const getSessionStorageHandler = (strategy) => {
  const ss = getSessionStorage();
  const ssh = new SessionStorageHandler('ssh', { strategy });
  sinon.stub(ssh, 'ss').get(() => ss);

  return ssh;
};

/**
 * Returns a configured InMemoryHandler.
 *
 * @param {StrategyHandler} strategy
 * @returns {InMemoryHandler}
 */

const getInMemoryHandler = (strategy) => new InMemoryHandler('imh', { strategy });

const strategies = [
  [getPasswordHandler, PASSWORD_CONTEXT],
  [getKeypairHandler, KEYPAIR_CONTEXT],
];

const storages = [
  getInMemoryHandler,
  getLocalStorageHandler,
  getSessionStorageHandler,
];

strategies.forEach(([getStrategy, context]) => {
  storages.forEach((getStorage) => {
    integrationMatchTest(getStrategy, getStorage, context);
  });
});
