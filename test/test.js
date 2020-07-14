var expect = require('chai').expect;
var assert = require('chai').assert;
var QrlNode  = require('../src/index.js');

var ip = '127.0.0.1';
var helpers = new QrlNode(ip, '3000');

describe('#helpers', function() {

  it(`.version should report same version as in npm package.json file (=${process.env.npm_package_version})`, function() {
    var result = helpers.version;
    expect(result).to.equal(process.env.npm_package_version);
  });

  it(`.ipAddress should report same as invoked in setup (${ip})`, function() {
    var result = helpers.ipAddress;
    expect(ip).to.equal(result);
  }); 

});
