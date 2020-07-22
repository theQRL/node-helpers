require("@babel/polyfill")
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const CryptoJS = require('crypto-js')
const {
  createClient
} = require('grpc-js-kit')
const {
  promisify
} = require('util')
const {
  QRLPROTO_SHA256
} = require('@theqrl/qrl-proto-sha256')
const tmp = require('tmp')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const dns = require('dns').promises
const PROTO_PATH = 'node_modules/@theqrl/qrlbase.proto/qrlbase.proto'
let qrlClient = null

async function clientGetNodeInfo (client) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.getNodeInfo({}, (error, response) => {
        if (error) {
          throw new Error(error)
        }
        resolve(response)
      })
    } catch (error) {
      throw new Error(error)
    }
  }).catch(error => {
    throw new Error('Unable to get valid proto file (' + error + ')')
  })
}

async function checkProtoHash(file) {
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
    return verified
  })
}

async function loadGrpcBaseProto(grpcEndpoint) {
  return new Promise((resolve, reject) => {
    return protoLoader.load(PROTO_PATH, {}).then(async packageDefinition => {
      try {
        const packageObject = grpc.loadPackageDefinition(packageDefinition)
        const client = await new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure())
        const res = await clientGetNodeInfo(client)
        const qrlProtoFilePath = tmp.fileSync({
          mode: '0644',
          prefix: 'qrl-',
          postfix: '.proto'
        }).name
        await writeFile(qrlProtoFilePath, res.grpcProto).then(fsErr => {
          if (fsErr) {
            reject('tmp filesystem error')
          }
        }).catch(error => {
          // throw new Error('Unable to load grpc base proto (' + error + ')')
        })
        resolve(qrlProtoFilePath)
      } catch (error) {
        throw new Error('Unable to load grpc base proto (' + error + ')')
      }
    })
  }).catch(error => {
    throw new Error('Unable to load grpc base proto (' + error + ')')
  })
}

async function loadGrpcProto(protofile, endpoint) {
  try {
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
      qrlClient = await createClient({
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
    }
  } catch (error) {
    throw new Error('Unable to load grpc proto file (' + error + ')')
  }
}

async function makeClient(grpcEndpoint) {
  try {
    const proto = await loadGrpcBaseProto(grpcEndpoint)
    const validHash = await checkProtoHash(proto)
    if (validHash) {
      const client = await loadGrpcProto(proto, grpcEndpoint)
      return client
    }
    return null
  } catch (error) {
    throw new Error('Unable to make client (' + error + ')')
  }
}

async function validate(node) {
  return dns.lookup(node)
}

class QrlNode {
  constructor(ipAddress, port) {
    this.version = '0.5.2'
    this.connection = false
    this.client = null
    this.ipAddress = ipAddress
    this.port = port
    validate(ipAddress).then((err, res) => {
      if (err) {
        return false
      }
      return true
    }).catch(error => {
      console.log(error)
    })  
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
    })
  }

  disconnect() {
    this.client = null
    this.connection = false
  }

  async validApi(apiCall) {
    const client = await this.client
    try {
      if (client[apiCall].path.substr(0, 5) === '/qrl.') {
        return true
      }
      return false
    } catch (error) {
      return false
    }
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