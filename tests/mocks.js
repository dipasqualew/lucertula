import sinon from 'sinon';


/**
 * Generates a dependency injector
 *
 * @param {?function} encrypt
 * @param {?function} decrypt
 * @returns {object}
 */
export const getDi = (encrypt = null, decrypt = null) => {

  if (!encrypt) {
    encrypt = sinon.fake.resolves('encrypted');
  }

  if (!decrypt) {
    decrypt = sinon.fake.resolves('decrypted');
  }

  return {
    strategy: {
      encrypt,
      decrypt,
    },
  };
};

/**
 * Creates a storage handler
 * with mocked dependency injection.
 *
 * @param {StorageHandler} kls
 * @param {?string} key
 * @param {?object} di
 */
export const getStorageHandler = (kls, key = 'StorageHandlerKey', di = null) => {
  if (!di) {
    di = getDi();
  }

  return new kls(key, di);
};

/**
 * Returns a mocked LocalStorage
 *
 * @returns {object}
 */
export const getLocalStorage = () => {
  const ls = { __data__: {} };
  ls.getItem = (key) => ls.__data__[key] || null;
  ls.setItem = (key, value) => (ls.__data__[key] = value);
  ls.removeItem = () => (ls.__data__ = {} );
  return ls;
};

/**
 * Returns a mocked SessionStorage
 *
 * @returns {object}
 */
export const getSessionStorage = () => {
  const ss = { __data__: {} };
  ss.getItem = (key) => ss.__data__[key] || null;
  ss.setItem = (key, value) => (ss.__data__[key] = value);
  ss.removeItem = () => (ss.__data__ = {} );

  return ss;
};


/**
 * Typical payload to be encrypted.
 * Also the content of the encrypted
 * blocks below.
 *
 * @const {object}
 */
export const PAYLOAD = {
  key1: 'value1',
  nested: {
    key2: 'value2',
  },
};

/**
 * Typical password used
 * in symmetrical strategies.
 * Also used for encryption of the
 * symmetrical block below.
 *
 * @const {string}
 */
export const PASSWORD = 'My Password';

/**
 * Public Key
 * See: https://github.com/openpgpjs/openpgpjs/blob/master/test/general/openpgp.js
 * Also used for encryption of the
 * keypair block below.
 *
 * @const {string}
 */
export const PUBLIC_KEY = [
  '-----BEGIN PGP PUBLIC KEY BLOCK-----',
  'Version: GnuPG v2.0.19 (GNU/Linux)',
  '',
  'mI0EUmEvTgEEANyWtQQMOybQ9JltDqmaX0WnNPJeLILIM36sw6zL0nfTQ5zXSS3+',
  'fIF6P29lJFxpblWk02PSID5zX/DYU9/zjM2xPO8Oa4xo0cVTOTLj++Ri5mtr//f5',
  'GLsIXxFrBJhD/ghFsL3Op0GXOeLJ9A5bsOn8th7x6JucNKuaRB6bQbSPABEBAAG0',
  'JFRlc3QgTWNUZXN0aW5ndG9uIDx0ZXN0QGV4YW1wbGUuY29tPoi5BBMBAgAjBQJS',
  'YS9OAhsvBwsJCAcDAgEGFQgCCQoLBBYCAwECHgECF4AACgkQSmNhOk1uQJQwDAP6',
  'AgrTyqkRlJVqz2pb46TfbDM2TDF7o9CBnBzIGoxBhlRwpqALz7z2kxBDmwpQa+ki',
  'Bq3jZN/UosY9y8bhwMAlnrDY9jP1gdCo+H0sD48CdXybblNwaYpwqC8VSpDdTndf',
  '9j2wE/weihGp/DAdy/2kyBCaiOY1sjhUfJ1GogF49rC4jQRSYS9OAQQA6R/PtBFa',
  'JaT4jq10yqASk4sqwVMsc6HcifM5lSdxzExFP74naUMMyEsKHP53QxTF0Grqusag',
  'Qg/ZtgT0CN1HUM152y7ACOdp1giKjpMzOTQClqCoclyvWOFB+L/SwGEIJf7LSCEr',
  'woBuJifJc8xAVr0XX0JthoW+uP91eTQ3XpsAEQEAAYkBPQQYAQIACQUCUmEvTgIb',
  'LgCoCRBKY2E6TW5AlJ0gBBkBAgAGBQJSYS9OAAoJEOCE90RsICyXuqIEANmmiRCA',
  'SF7YK7PvFkieJNwzeK0V3F2lGX+uu6Y3Q/Zxdtwc4xR+me/CSBmsURyXTO29OWhP',
  'GLszPH9zSJU9BdDi6v0yNprmFPX/1Ng0Abn/sCkwetvjxC1YIvTLFwtUL/7v6NS2',
  'bZpsUxRTg9+cSrMWWSNjiY9qUKajm1tuzPDZXAUEAMNmAN3xXN/Kjyvj2OK2ck0X',
  'W748sl/tc3qiKPMJ+0AkMF7Pjhmh9nxqE9+QCEl7qinFqqBLjuzgUhBU4QlwX1GD',
  'AtNTq6ihLMD5v1d82ZC7tNatdlDMGWnIdvEMCv2GZcuIqDQ9rXWs49e7tq1NncLY',
  'hz3tYjKhoFTKEIq3y3Pp',
  '=h/aX',
  '-----END PGP PUBLIC KEY BLOCK-----',
].join('\n');

/**
 * Private Key
 * See: https://github.com/openpgpjs/openpgpjs/blob/master/test/general/openpgp.js
 * Also used for encryption of the
 * keypair block below.
 *
 * @const {string}
 */
export const PRIVATE_KEY = [
  '-----BEGIN PGP PRIVATE KEY BLOCK-----',
  'Version: GnuPG v2.0.19 (GNU/Linux)',
  '',
  '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',
  '=lw5e',
  '-----END PGP PRIVATE KEY BLOCK-----',
].join('\n');

/**
 * Keypair Passphrase
 * See: https://github.com/openpgpjs/openpgpjs/blob/master/test/general/openpgp.js
 * Also used for encryption of the
 * keypair block below.
 *
 * @const {string}
 */
export const KEYPAIR_PASSPHRASE = 'hello world';

/**
 * Encrypted block with password.
 *
 * @const {string}
 */
export const ENCRYPTED_WITH_PASSWORD = [
  '-----BEGIN PGP MESSAGE-----',
  'Version: OpenPGP.js v4.10.7',
  'Comment: https://openpgpjs.org',
  '',
  'wy4ECQMIUStwmlBXSuTg4Mo/M9Zj+Reg826iE1iPExBXHdaU3Ktp9wN90P8H',
  'b/Ht0mQBxI+yovyXiN7gz6nU5RhWEpcZK62ce5oF0Fs46b0I7JaI+VAUxk82',
  'UK+YhRqZM7krJQyrUWUs2OxxJgRqwEFwRaUSbqI6OcqScohwFU0nqYm+bWJp',
  'hR9IF7C8ybBoucFuRfPC',
  '=w7+B',
  '-----END PGP MESSAGE-----',
].join('\n');

/**
 * Encrypted block with keypair.
 *
 * @const {string}
 */
export const ENCRYPTED_WITH_KEYPAIR = [
  '-----BEGIN PGP MESSAGE-----',
  'Version: OpenPGP.js v4.10.7',
  'Comment: https://openpgpjs.org',
  '',
  'wYwD4IT3RGwgLJcBBAC3jmUl83eAJ420n8hpRMPo0CCm5prgHiySB96zEHk0',
  '/darqNS1z4qn3pCEhIL6CE1xBDf8B1CwYoE3Dn8pa+FTxvaqWlV9BlEkGyYf',
  'rV+1Gp2drXZrAHCD5ZBJIIDx/dooHFTTdGQ03MOcpg+fGYKEnfOGUsJOmkrW',
  'ww3iBkVfN9LAaAFlFygqGDfXbahffUcnskT/sjhrMUfOjysPhdwsWNGk5bqE',
  'S99MeKd4ujVBvv9PqVKcM/rGcdoiFG/JofboMlg55nWannhPe9R74S4fFwBJ',
  'IWXU1g1oneT/I7UcUKL9Vnk2cwyBSHCFB8ptA6O2JSMutaJcDyjzLFOnSNSY',
  'zLuZby5rZtxFMQwSjm2zCUnC//Z6/12RVR3aQlRprbDqVtm3MrhEUBV/kwG4',
  '8LljDo8C7D1QzrU8aFPFsLz/vUZpxMge+PaE1xEZgroqDNPgJO9/eiGGfnMg',
  'gdyUMr5afVb164SkdYBsRCmoTh1dncrsRSpepPCGDIgoJqpYm7+/tBqI/qGy',
  'eUMSBKU2dYhE8J37dWQ+D4FUhXIt/oDj9ltDDPSF1v4axwzu',
  '=TpPQ',
  '-----END PGP MESSAGE-----',
].join('\n');
