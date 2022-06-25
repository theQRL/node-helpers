var QrlNode  = require('../src/index.js')

var chaiAsPromised = require("chai-as-promised")
var chai = require("chai")
chai.use(chaiAsPromised)
var expect = chai.expect
var assert = chai.assert
var ip = 'mainnet-3.automated.theqrl.org'
var port = '19009'

var state = 0

// process.on('unhandledRejection', error => {
  // uncomment to review unhandled Promise rejections to debug
  // console.log('unhandledRejection', error.message)
// })

describe('#mainnet', function() {
  var mainnet = new QrlNode(ip, port)
  it(`.version should report same version as in npm package.json file (=${process.env.npm_package_version})`, function() {
    var result = mainnet.version
    expect(result).to.equal(process.env.npm_package_version)
  })

  it(`.ipAddress should report same as invoked in setup (${ip})`, function() {
    var result = mainnet.ipAddress
    expect(ip).to.equal(result)
  }) 

  it(`.port should report same as invoked in setup (${port})`, function() {
    var result = mainnet.port
    expect(port).to.equal(result)
  }) 

  it('mainnet node should report SYNCED', async function() {
    async function node() {
      return new Promise(async (resolve, reject) => {
        const client = await mainnet.connect()
        return await client.GetStats({}, (error, response) => {
          if (error) {
            throw new Error(error)
          }
          state = 1
          resolve(response.node_info.state)
        })
      })
    }
    await expect(node()).to.eventually.equal('SYNCED')
  })

  var check = function(done) {
    if (state === 1) {
      done()
    } else {
      setTimeout( function() { check(done) }, 1000)
    }
  }

  it('expect GetOTS to function if called from existing client connection', async function() {
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
          state = 2
          resolve(response.unused_ots_index_found)
        })
      })
    }
    await expect(node()).to.eventually.equal(true)
  })

  var check = function(done) {
    if (state === 2) {
      done()
    } else {
      setTimeout( function() { check(done) }, 1000)
    }
  }

  it('a second attempted connection should have its Promise rejected', async function() {
    async function node() {
      return await mainnet.connect()
    }
    await expect(node()).to.eventually.be.rejected
    state = 3
  })
  
  var check = function(done) {
    if (state === 3) {
      done()
    } else {
      setTimeout( function() { check(done) }, 1000)
    }
  }

  it('an invalid node ip/port should result in a null connecion', async function() {
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
      state = 4
      return testnet.connection
    }
    await expect(node()).to.eventually.equal(false)
  })

  var check = function (done) {
    if (state === 4) {
      done()
    } else {
      setTimeout(function () {
        check(done)
      }, 1000)
    }
  }

  it('testnet node should have \'Testnet 2022\' as its network_id', async function() {
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
          state = 5
          resolve(response.node_info.network_id)
        })
      })
    }
    await expect(node()).to.eventually.equal('Testnet 2022')
  })

  var check = function (done) {
    if (state === 5) {
      done()
    } else {
      setTimeout(function () {
        check(done)
      }, 1000)
    }
  }

  it('.disconnect() should reset client and return .connection = false', function() {
    mainnet.disconnect()
    var status = mainnet.connection
    var client = mainnet.client
    expect(status).to.equal(false)
    expect(client).to.equal(null)
    state = 6
  }) 

  var check = function (done) {
    if (state === 6) {
      done()
    } else {
      setTimeout(function () {
        check(done)
      }, 1000)
    }
  }

  it('reconnection connection should have its Promise resolve', async function() {
    async function node() {
      return await mainnet.connect()
    }
    await expect(node()).to.eventually.not.be.rejected
    state = 7
  })

  var check = function (done) {
    if (state === 7) {
      done()
    } else {
      setTimeout(function () {
        check(done)
      }, 1000)
    }
  }

  it('expect GetOTS to be reported as a valid API call', async function() {
    await expect(mainnet.validApi('GetOTS')).to.eventually.not.be.rejected
    await expect(mainnet.validApi('GetOTS')).to.eventually.to.equal(true)
    state = 8
  })  // await node to be ready before checking if API state is checkable

  var check = function (done) {
    if (state === 8) {
      done()
    } else {
      setTimeout(function () {
        check(done)
      }, 1000)
    }
  }

  it('expect ThisIsInvalid to be reported as an invalid API call', async function() {
    await expect(mainnet.validApi('ThisIsInvalid')).to.eventually.not.be.rejected
    await expect(mainnet.validApi('ThisIsInvalid')).to.eventually.to.equal(false)
    state = 9
  })

  var check = function (done) {
    if (state === 9) {
      done()
    } else {
      setTimeout(function () {
        check(done)
      }, 1000)
    }
  }

  it('mainnet node should report SYNCED after a GetStats API call', async function() {
    await expect(mainnet.api('GetStats')).to.eventually.have.property('node_info').property('state').equal('SYNCED')
  })

})
