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

const clientGetNodeInfo = async client => {
  return new Promise((resolve, reject) => {
    client.getNodeInfo({}, (error, response) => {
      if (error) {
        reject(error)
      }
      resolve(response)
    })
  }).catch(error => {
    throw new Error('Unable to get valid proto file (' + error + ')')
  })
}

async function checkProtoHash(file) {
  return new Promise((resolve, reject) => {
    return readFile(file).then(async contents => {
      const protoFileWordArray = CryptoJS.lib.WordArray.create(contents.toString())
      const calculatedProtoHash = CryptoJS.SHA256(protoFileWordArray).toString(CryptoJS.enc.Hex)
      let verified = false
      QRLPROTO_SHA256.forEach(value => {
        if (value.protoHash) {
          if (value.protoHash === calculatedProtoHash) {
            verified = true
          }
        }
      })
      resolve(verified)
    }).catch(error => {
      reject(error)
    })
  }).catch(error => {
    throw new Error('Unable to check proto file hash (' + error + ')')
  })
}

async function loadGrpcBaseProto(grpcEndpoint) {
  return new Promise(async (resolve, reject) => {
    return protoLoader.load(PROTO_PATH, {}).then(async packageDefinition => {
      const packageObject = grpc.loadPackageDefinition(packageDefinition)
      const client = await new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure())
      const res = await clientGetNodeInfo(client)
      const qrlProtoFilePath = tmp.fileSync({mode: '0644', prefix: 'qrl-', postfix: '.proto'}).name
      await writeFile(qrlProtoFilePath, res.grpcProto).then(fsErr => {
        if (fsErr) {
          reject('tmp filesystem error')
        }
      })
      resolve(qrlProtoFilePath)
    })
  }).catch(error => {
    throw new Error('Unable to load grpc base proto (' + error + ')')
  })
} 

async function loadGrpcProto(protofile, endpoint) {
  return new Promise(async (resolve, reject) => {
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
      if (value.objectHash) {
        if (value.objectHash === calculatedObjectHash) {
          verified = true
        }
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
        resolve(qrlClient)
      } catch (error) {
        reject(error)
      }
    }
    console.log('Unable to verifty proto file - have hashes changed?') // eslint-disable-line no-console
    reject('Unable to verify proto file')
  }).catch(error => {
    throw new Error('Unable to load grpc proto file (' + error + ')')
  })
}

async function makeClient (grpcEndpoint) {
  return new Promise(async (resolve, reject) => {
    const proto = await loadGrpcBaseProto(grpcEndpoint)
    const validHash = await checkProtoHash(proto)
    if (validHash) {
      const client = await loadGrpcProto(proto, grpcEndpoint)
      resolve(client)
    }
    reject(null)
  }).catch(error => {
    throw new Error('Unable to make client (' + error + ')')
  })
}

class QrlNode {
  constructor(ipAddress, port) {
    this.version = '0.5.2'
    this.ipAddress = ipAddress
    this.port = port
    this.connection = false
    this.client = null
  }
  
  async connect() {
    return new Promise(async (resolve, reject) => {
      if (this.connection === false) {
        const client = await makeClient(`${this.ipAddress}:${this.port}`)
        this.connection = true
        this.client = client
        resolve(client)
      }
      reject('Already connected... disconnect first or create a new connection')
    }).catch(error => {
      throw new Error('Unable to connect (' + error + ')')
    })
  }

  disconnect() {
    this.client = null
    this.connection = false
  }

  async validApi(apiCall) {
    const client = await this.client
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
      }).catch(error => {
        throw new Error('Unable to make API call (' + error + ')')
      })
    }

}

module.exports = QrlNode
