require("@babel/polyfill")
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const CryptoJS = require('crypto-js')
const { createClient } = require('grpc-js-kit')
const { promisify } = require('util')
const { QRLPROTO_SHA256 } = require('@theqrl/qrl-proto-sha256')
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

async function checkProtoHash(file) {
  return readFile(file).then(async contents => {
    const protoFileWordArray = CryptoJS.lib.WordArray.create(contents.toString())
    const calculatedProtoHash = CryptoJS.SHA256(protoFileWordArray).toString(CryptoJS.enc.Hex)
    let verified = false
    QRLPROTO_SHA256.forEach(value => {
      if (value.protoSha256 === calculatedProtoHash) {
        verified = true
      }
    })
    return verified
  }).catch(error => {
    throw new Error(error)
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
  const grpcObjectString = JSON.stringify(grpcObject.qrl)
  const protoObjectWordArray = CryptoJS.lib.WordArray.create(grpcObjectString)
  const calculatedObjectHash = CryptoJS.SHA256(protoObjectWordArray).toString(CryptoJS.enc.Hex)
  let verified = false
  QRLPROTO_SHA256.forEach(value => {
    if (value.memoryHash === calculatedObjectHash) {
      verified = true
    }
  })
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
  const validHash = await checkProtoHash(proto)
  if (validHash) {
    const client = await loadGrpcProto(proto, grpcEndpoint)
    return client
  }
  return null
}

class QrlNode {
  constructor(ipAddress, port) {
    this.version = '0.5.2'
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
