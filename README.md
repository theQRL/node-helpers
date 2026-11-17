# @theqrl/node-helpers

[![CI](https://github.com/theQRL/node-helpers/actions/workflows/ci.yml/badge.svg)](https://github.com/theQRL/node-helpers/actions/workflows/ci.yml) [![npm version](https://badge.fury.io/js/%40theqrl%2Fnode-helpers.svg)](https://badge.fury.io/js/%40theqrl%2Fnode-helpers) ![GitHub](https://img.shields.io/github/license/theqrl/node-helpers)

A helper library for interacting with QRL nodes via gRPC.

## Installation

Requires Node.js 22.13.0 or newer.

```sh
npm install @theqrl/node-helpers
```

## Usage

```javascript
const QrlNode = require('@theqrl/node-helpers')
// ES modules: import QrlNode from '@theqrl/node-helpers'

async function main() {
  const node = new QrlNode('testnet-1.automated.theqrl.org', 19009)
  try {
    const client = await node.connect()
    if (!client) throw new Error('Node supplied an unapproved proto')
    console.log(await node.api('GetStats'))
  } finally {
    node.disconnect()
  }
}

main().catch(console.error)
```

- `connect()` resolves to the gRPC client and sets `connection` to `true`.
  An unapproved proto returns `null`, leaving the node disconnected.
  Transport, filesystem, and proto loading failures reject the promise.
  Connecting while already connected also rejects.
- `validApi(name)` resolves to whether the connected client exposes that QRL RPC.
- `api(name, request = {})` resolves to the RPC response. Unavailable methods
  and RPC errors reject the promise.
- `disconnect()` closes the gRPC client and resets `client` and `connection`.

The downloaded proto's bytes are checked against the SHA-256 allowlist in
`@theqrl/qrl-proto-sha256` before loading it. Version 0.8.0 replaces the legacy
CryptoJS checks, including the hash of serialized loader internals, with this
standard SHA-256 check so dependency updates do not invalidate approved protos.
Connections use insecure gRPC credentials, as in previous releases.

## Development

```sh
mise install
mise exec -- npm ci
mise exec -- npm run lint
mise exec -- npm run build
mise exec -- npm test
mise exec -- npm audit
```

Alternatively, use `nvm use` to select Node 22. `npm run build` copies the native
CommonJS source to `dist`; Babel and polyfills are no longer needed. `npm pack`
automatically rebuilds the package.

Tests use a local gRPC server and an approved QRL proto fixture; no public node
or network access is needed. `npm run cover` reports coverage using Node's built-in
test runner. GitHub Actions runs lint, build, tests, and audit on Node 22, 24, and 26.

Contact jp@theqrl.org if you are interested in contributing. PRs welcomed.
