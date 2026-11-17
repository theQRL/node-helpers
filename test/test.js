const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const QrlNode = require('..')
const { version } = require('../package.json')

const protoPath = path.join(__dirname, 'fixtures/qrl.proto')
const proto = readFileSync(protoPath, 'utf8')
const base = grpc.loadPackageDefinition(protoLoader.loadSync(
  require.resolve('@theqrl/qrlbase.proto/qrlbase.proto')
)).qrl
const api = grpc.loadPackageDefinition(protoLoader.loadSync(protoPath, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
  includeDirs: [path.dirname(require.resolve('google-proto-files/package.json'))],
})).qrl

async function serve(t, getNodeInfo, getStats) {
  const server = new grpc.Server()
  server.addService(base.Base.service, { getNodeInfo })
  if (getStats) server.addService(api.PublicAPI.service, { GetStats: getStats })
  t.after(() => server.forceShutdown())
  const port = await new Promise((resolve, reject) => {
    server.bindAsync('127.0.0.1:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) reject(error)
      else resolve(port)
    })
  })
  const node = new QrlNode('127.0.0.1', port)
  t.after(() => node.disconnect())
  return node
}

test('constructor and disconnected API behavior', async () => {
  const node = new QrlNode('localhost', 19009)
  assert.equal(node.version, version)
  assert.equal(node.ipAddress, 'localhost')
  assert.equal(node.port, 19009)
  assert.equal(node.client, null)
  assert.equal(node.connection, false)
  assert.equal(await node.validApi('GetStats'), false)
  await assert.rejects(node.api('GetStats'), /Unavailable QRL API/)
  node.disconnect()
})

test('connect, call, disconnect, and reconnect using an approved proto', async t => {
  const node = await serve(t,
    (_, callback) => callback(null, { grpcProto: proto }),
    (call, callback) => {
      assert.equal(call.request.include_timeseries, true)
      callback(null, { node_info: { state: 'SYNCED' } })
    })
  assert.ok(await node.connect())
  assert.equal(node.connection, true)
  await assert.rejects(node.connect(), /Already connected/)
  assert.equal(await node.validApi('GetStats'), true)
  assert.equal(await node.validApi('missing'), false)
  assert.equal(await node.validApi('close'), false)
  assert.equal((await node.api('GetStats', { include_timeseries: true })).node_info.state, 'SYNCED')
  await assert.rejects(node.api('missing'), /Unavailable QRL API/)
  node.disconnect()
  assert.equal(node.connection, false)
  assert.equal(node.client, null)
  assert.ok(await node.connect())
})

test('rejects unapproved proto bytes without connecting', async t => {
  const node = await serve(t, (_, callback) => callback(null, { grpcProto: proto + '\n' }))
  assert.equal(await node.connect(), null)
  assert.equal(node.connection, false)
  assert.equal(node.client, null)
})

test('base RPC failures reject and leave the node disconnected', async t => {
  const node = await serve(t, (_, callback) => callback({ code: grpc.status.UNAVAILABLE, details: 'offline' }))
  await assert.rejects(node.connect(), /offline/)
  assert.equal(node.connection, false)
  assert.equal(node.client, null)
})

test('API RPC failures reject', async t => {
  const node = await serve(t,
    (_, callback) => callback(null, { grpcProto: proto }),
    (_, callback) => callback({ code: grpc.status.INVALID_ARGUMENT, details: 'bad request' }))
  await node.connect()
  await assert.rejects(node.api('GetStats'), /bad request/)
})
