require("@babel/polyfill")
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const {createClient} = require('grpc-js-kit')
const { promisify } = require('util')
const tmp = require('tmp')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const PROTO_PATH = 'node_modules/@theqrl/qrlbase.proto/qrlbase.proto'
let qrlClient = null

const clientGetNodeInfo = client => {
  return new Promise((resolve, reject) => {
    client.getNodeInfo({}, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    })
  })
}

async function loadGrpcBaseProto(grpcEndpoint) {
  return protoLoader.load(PROTO_PATH, {}).then(async packageDefinition => {
    const packageObject = grpc.loadPackageDefinition(packageDefinition)
    const client = await new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure())
    const res = await clientGetNodeInfo(client)
    const qrlProtoFilePath = tmp.fileSync({mode: '0644', prefix: 'qrl-', postfix: '.proto'}).name
    await writeFile(qrlProtoFilePath, res.grpcProto).then(fsErr => {
      if (fsErr) {
        throw new TypeError('tmp filesystem error')
      }
    })
    return qrlProtoFilePath
  })
} 

async function loadGrpcProto(protofile, endpoint) {
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
  const packageDefinition = await protoLoader.load(protofile, options)
  const grpcObject = await grpc.loadPackageDefinition(packageDefinition)
  let verified = true
  // QRLPROTO_SHA256.forEach(value => {
  //   if (value.memoryHash === calculatedObjectHash) {
  //     verified = true
  //   }
  // })
  // If the grpc object shasum matches, establish the grpc connection.
  if (verified) {
    try {
      qrlClient = createClient({
        protoPath: protofile,
        packageName: 'qrl',
        serviceName: 'PublicAPI',
        options: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      }, endpoint)
      return qrlClient
    } catch (error) {
      throw new TypeError(error)
    }

  }
  console.log('Unable to verifty proto file - have hashes changed?') // eslint-disable-line no-console
  throw new TypeError('Unable to verify proto file')
}

async function makeClient (grpcEndpoint) {
  const proto = await loadGrpcBaseProto(grpcEndpoint)
  const client = await loadGrpcProto(proto, grpcEndpoint)
  return client
}

class QrlNode {
  constructor(ipAddress, port) {
    this.version = '0.5.1'
    this.ipAddress = ipAddress
    this.port = port
    this.connection = false
    this.client = null
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      if (this.connection === false) {
        const client = makeClient(`${this.ipAddress}:${this.port}`)
        this.connection = true
        this.client = client
        resolve(client)
      }
      reject('Already connected... disconnect first or create a new connection')
    })
  }

  disconnect() {
    this.client = null
    this.connection = false
  }

  validApi(apiCall) {
    const client = this.client
    return client.then(result => {
      try {
        if (result[apiCall].path.substr(0,5) === '/qrl.') {
          return true
        }
        return false
      } catch (error) {
        return false
      }
    })
  }

  api(apiCall, request = {}) {
      return new Promise(async (resolve, reject) => {
        const client = await this.client
        client[apiCall](request, async (error, response) => {
          if (error) {
            reject(error)
          }
          resolve(response)
        })
      })
  }

}
module.exports = QrlNode
