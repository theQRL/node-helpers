var expect = require('chai').expect;
var assert = require('chai').assert;
var helpers = require('../index.js');

describe('#helpers', function() {

  it(`.version should report same version as in npm package.json file (=${process.env.npm_package_version})`, function() {
    var result = helpers.version();
    expect(result).to.equal(process.env.npm_package_version);
  });

});