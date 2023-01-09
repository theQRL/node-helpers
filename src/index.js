require('@babel/polyfill')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const CryptoJS = require('crypto-js')
const { promisify } = require('util')
const { QRLPROTO_SHA256 } = require('@theqrl/qrl-proto-sha256')
const tmp = require('tmp')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
let PROTO_PATH = __dirname + '/../node_modules/@theqrl/qrlbase.proto/qrlbase.proto'
if (__dirname.includes('/node_modules/')) {
  PROTO_PATH = __dirname + '/../../qrlbase.proto/qrlbase.proto'
}
let GOOGLE_PATH = __dirname + '/../node_modules/google-proto-files/'
if (__dirname.includes('/node_modules/')) {
  GOOGLE_PATH = __dirname + '/../../../google-proto-files/'
}
let qrlClient = null

function clientGetNodeInfo (client) {
  try {
    return new Promise((resolve, reject) => {
      client.getNodeInfo({}, (error, response) => {
        if (error) {
          reject(error)
        }
        resolve(response)
      })
    })
  } catch (error) {
    console.log(error)
  }
}

function checkProtoHash(file) {
  return readFile(file).then(contents => {
    // console.log(contents)
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

function loadGrpcBaseProto(grpcEndpoint) {
    return protoLoader.load(PROTO_PATH, {}).then(async packageDefinition => {
      try {
        const packageObject = await grpc.loadPackageDefinition(packageDefinition)
        const client = await new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure())
        // console.log(client)
        const res = await clientGetNodeInfo(client)
        const qrlProtoFilePath = tmp.fileSync({
          mode: '0644',
          prefix: 'qrl-',
          postfix: '.proto'
        }).name
        writeFile(qrlProtoFilePath, res.grpcProto).then(fsErr => {
          if (fsErr) { console.log('tmp filesystem error') }
        })
        return(qrlProtoFilePath)
      } catch (error) {
        console.log('Unable to load grpc base proto (' + error + ')')
      }
    })
}

async function loadGrpcProto(protofile, endpoint) {
    const options = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [GOOGLE_PATH],
    }
    const packageDefinition = await protoLoader.load(protofile, options)
    const grpcObject = grpc.loadPackageDefinition(packageDefinition)
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
      return new grpcObject.qrl.PublicAPI(
        endpoint,
        grpc.credentials.createInsecure()
      )
    }
}

async function makeClient(grpcEndpoint) {
    const proto = await loadGrpcBaseProto(grpcEndpoint)
    if (proto) {
      let validHash = await checkProtoHash(proto)
      if (validHash) {
        const client = await loadGrpcProto(proto, grpcEndpoint)
        return client
      }
    }
    return null
}


class QrlNode {
  constructor(ipAddress, port) {
    this.version = '0.7.2'
    this.connection = false
    this.client = null
    this.ipAddress = ipAddress
    this.port = port
  }

  async connect() {
    if (this.connection === false) {
      const client = await makeClient(`${this.ipAddress}:${this.port}`)
      if (client === null) {
        this.connection = false
      } else {
        this.connection = true
      }
      this.client = client
      return client
    }
    throw new Error('Already connected')
  }

  disconnect() {
    this.client = null
    this.connection = false
  }

  async validApi(apiCall) {
    try {
      const client = await this.client
      if (client[apiCall].path.substr(0, 5) === '/qrl.') { return true }
      return false
    } catch (error) {
      return false
    }
  }

  async api(apiCall, request = {}) {
    try {
      return new Promise(async (resolve, reject) => {
        const client = await this.client
        client[apiCall](request, async (error, response) => {
          if (error) {
            reject(error)
          }
          resolve(response)
        })
      })
    } catch (error) {
      console.log('Unable to make API call (' + error + ')')
    }
  }
}

module.exports = QrlNode