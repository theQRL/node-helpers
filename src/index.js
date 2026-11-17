const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { createHash } = require('node:crypto')
const { mkdtemp, readFile, writeFile, rm } = require('node:fs/promises')
const { tmpdir } = require('node:os')
const path = require('node:path')
const { QRLPROTO_SHA256 } = require('@theqrl/qrl-proto-sha256')
const { version } = require('../package.json')

const PROTO_PATH = require.resolve('@theqrl/qrlbase.proto/qrlbase.proto')
const GOOGLE_PATH = path.dirname(require.resolve('google-proto-files/package.json'))

function verifiedProto(contents) {
  const hash = createHash('sha256').update(contents).digest('hex')
  // Verify the downloaded bytes, rather than a loader-version-dependent object.
  return QRLPROTO_SHA256.some(entry => entry.protoSha256 === hash)
}

function call(client, method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) reject(error)
      else resolve(response)
    })
  })
}

async function makeClient(endpoint) {
  let baseClient
  let directory
  try {
    const definition = await protoLoader.load(PROTO_PATH)
    const base = grpc.loadPackageDefinition(definition)
    baseClient = new base.qrl.Base(endpoint, grpc.credentials.createInsecure())
    const response = await call(baseClient, 'getNodeInfo', {})
    directory = await mkdtemp(path.join(tmpdir(), 'qrl-'))
    const proto = path.join(directory, 'qrl.proto')
    await writeFile(proto, response.grpcProto)
    if (!verifiedProto(await readFile(proto))) return null

    const packageDefinition = await protoLoader.load(proto, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [GOOGLE_PATH],
    })
    const api = grpc.loadPackageDefinition(packageDefinition).qrl
    return new api.PublicAPI(endpoint, grpc.credentials.createInsecure())
  } finally {
    baseClient?.close()
    if (directory) await rm(directory, { recursive: true, force: true })
  }
}

class QrlNode {
  constructor(ipAddress, port) {
    this.version = version
    this.connection = false
    this.client = null
    this.ipAddress = ipAddress
    this.port = port
  }

  async connect() {
    if (this.connection) throw new Error('Already connected')
    this.client = await makeClient(`${this.ipAddress}:${this.port}`)
    this.connection = this.client !== null
    return this.client
  }

  disconnect() {
    this.client?.close()
    this.client = null
    this.connection = false
  }

  async validApi(apiCall) {
    const method = this.client?.[apiCall]
    return typeof method === 'function' && method.path?.startsWith('/qrl.') === true
  }

  async api(apiCall, request = {}) {
    if (!(await this.validApi(apiCall))) {
      throw new Error(`Unavailable QRL API: ${apiCall}`)
    }
    return call(this.client, apiCall, request)
  }
}

module.exports = QrlNode
