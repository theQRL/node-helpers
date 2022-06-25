var QrlNode  = require('../src/index.js')

var chaiAsPromised = require("chai-as-promised")
var chai = require("chai")
const { step } = require('mocha-steps')
chai.use(chaiAsPromised)
var expect = chai.expect
var assert = chai.assert
var ip = 'mainnet-3.automated.theqrl.org'
var port = '19009'

// process.on('unhandledRejection', error => {
  // uncomment to review unhandled Promise rejections to debug
  // console.log('unhandledRejection', error.message)
// })

describe('#mainnet', function() {
  var mainnet = new QrlNode(ip, port)
  step(`.version should report same version as in npm package.json file (=${process.env.npm_package_version})`, function() {
    var result = mainnet.version
    expect(result).to.equal(process.env.npm_package_version)
  })

  step(`.ipAddress should report same as invoked in setup (${ip})`, function() {
    var result = mainnet.ipAddress
    expect(ip).to.equal(result)
  }) 

  step(`.port should report same as invoked in setup (${port})`, function() {
    var result = mainnet.port
    expect(port).to.equal(result)
  }) 

  step('mainnet node should report SYNCED', async function() {
    async function node() {
      return new Promise(async (resolve, reject) => {
        const client = await mainnet.connect()
        return await client.GetStats({}, (error, response) => {
          if (error) {
            throw new Error(error)
          }
          resolve(response.node_info.state)
        })
      })
    }
    return await expect(node()).to.eventually.equal('SYNCED')
  })

  step('expect GetOTS to function if called from existing client connection', async function() {
    async function node() {
      return new Promise(async (resolve, reject) => {
        const request = {
          address: Buffer.from('010500bc576efa69fd6cbc854f2224f149f0b0a4d18fcb30c1feab64781245f4f27a61874227f3', 'hex'),
        }
        const client = await mainnet.client
        client.GetOTS(request, (error, response) => {
          if (error) {
            throw new Error(error)
          }
          resolve(response.unused_ots_index_found)
        })
      })
    }
    return await expect(node()).to.eventually.equal(true)
  })

  step('a second attempted connection should have its Promise rejected', async function() {
    async function node() {
      return await mainnet.connect()
    }
    return await expect(node()).to.eventually.be.rejected
  })
  
  step('an invalid node ip/port should result in a null connecion', async function() {
    async function node() {
      const badip = 'bad-ip.automated.theqrl.org'
      const badport = '19009'
      let id = null
      var testnet = new QrlNode(badip, badport)
      try {
        var client = await testnet.connect()
      } catch (error) {
        // consolse.log('er:', error)
      }
      return testnet.connection
    }
    return await expect(node()).to.eventually.equal(false)
  })

  step('testnet node should have \'Testnet 2022\' as its network_id', async function() {
    async function node() {
      return new Promise(async (resolve, reject) => {
        ip = 'testnet-1.automated.theqrl.org'
        port = '19009'
        let id = null
        var testnet = new QrlNode(ip, port)
        const client = await testnet.connect()
        client.GetStats({}, (error, response) => {
          if (error) {
            throw new Error(error)
          }
          resolve(response.node_info.network_id)
        })
      })
    }
    return await expect(node()).to.eventually.equal('Testnet 2022')
  })

  step('.disconnect() should reset client and return .connection = false', function() {
    mainnet.disconnect()
    var status = mainnet.connection
    var client = mainnet.client
    expect(status).to.equal(false)
    expect(client).to.equal(null)
  }) 

  step('reconnection connection should have its Promise resolve', async function() {
    async function node() {
      return await mainnet.connect()
    }
    await expect(node()).to.eventually.not.be.rejected
  })

  step('expect GetOTS to be reported as a valid API call', async function() {
    await expect(mainnet.validApi('GetOTS')).to.eventually.not.be.rejected
    await expect(mainnet.validApi('GetOTS')).to.eventually.to.equal(true)
  })  // await node to be ready before checking if API state is checkable

  step('expect ThisIsInvalid to be reported as an invalid API call', async function() {
    await expect(mainnet.validApi('ThisIsInvalid')).to.eventually.not.be.rejected
    await expect(mainnet.validApi('ThisIsInvalid')).to.eventually.to.equal(false)
  })

  step('mainnet node should report SYNCED after a GetStats API call', async function() {
    await expect(mainnet.api('GetStats')).to.eventually.have.property('node_info').property('state').equal('SYNCED')
  })

})
