# Lucertula
![Test and Publish](https://github.com/dipasqualew/lucertula/workflows/Test%20and%20Publish/badge.svg)
[![codecov](https://codecov.io/gh/dipasqualew/lucertula/branch/master/graph/badge.svg)](https://codecov.io/gh/dipasqualew/lucertula)

## Why

Welcome to Lucertula! Easy encryption of user data in their web browser.

This library aims to simplify encryption and decryption running in the browser, protecting user data without involving remote servers.

When it comes to user data security, the easiest and common strategy is to store confidential data in the server, ideally encrypted in transit and at rest. However, with the advent of JAMstacks, we might be able to remove server interactions completely and keep all the user data in the user's browser, or in a location of their preference. Not only this would protect the user's privacy, but it would free up server side resources, possibly removing them completely.

However, sensible data should be encrypted. Moving user data to the frontend is not a reason to keep confidential information in plaintext, as the web browser may shared, and this would expose private data to unauthorised users.

Lucertula aims to help you with that. It doesn't implement encryption/decryption algorythms, but rather exposes utility methods and shortcuts to easily encrypt and decrypt through a number of strategies, namily from OpenPGP JS and the WebCrypto API, and storing data against a number of storages. In particular:

**Storages**

- `window.localStorage`
- `window.sessionStorage`
- In Memory: Useful for development, keeps the data in a runtime JavaScript object.
- _WIP: Remote_: Write and read data from a remote location of your (or your user's) choice

**Algorythms**

- `openpgpjs` symmetric encryption (using a password)
- `openpgpjs` asymmetric encryption (using private and public keys)
- `crypto.subtle` (WebCrypto API) AES-GCP

See the incredible work done by the folk at `openpgpjs`:
[https://github.com/openpgpjs/openpgpjs](https://github.com/openpgpjs/openpgpjs)

## API

Any storage is compatible with any algorythm.

The library supports tree-shaking, so it is recommended to import storages and strategies directly.

You will need to import one storage and one strategy, create an instance of each, and then you will have an encryption handler:

```js
import { LocalStorageHandler } from 'lucertula/storage/localStorage';
import { WebCryptoAesGcpHandler } from 'lucertula/strategy/web/aes-gcp';

const strategy = new WebCryptoAesGcpHandler();
const handler = new LocalStorageHandler('localstorage-key-to-be-used', {
  strategy,
  localStorage: window.localStorage,
});

...

// Encrypt a string
const encrypted = await strategy.encrypt({ password }, plaintext);

// Decrypt a string
const decrypted = await strategy.decrypt({ password }, encrypted);

// Load and decrypts the data from the storage
const fromMemory = await handler.load({ password });

// Encrypts and saves the data to the storage
await handler.save({ password }, payload);

```

All storages expose a public API:

- `storage.load`: Provided the encryption context (see strategies), it will return the decrypted data from the storage
- `storage.save`: Provided the encryption context (see strategies), it will encrypt and then store the data to the storage

All strategies expose a public API:

- `strategy.encrypt`: Encrypts the provided string
- `strategy.decrypt`: Decrypts the provided string

See the [documentation site](https://keylocal.dipasqualew.com/) for each strategy encryption context.

## Contributing

Issues and PR are welcome'd! As encryption is a difficult subject, I will gladly review all feedback. Thanks!

## License

This library is aimed to help developers focus on user privacy and security and released under the MIT License.
