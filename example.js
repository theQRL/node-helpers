var QrlNode = require('./dist/index.js')

var ip = 'testnet-1.automated.theqrl.org';
var port = '19009';
var testnet = new QrlNode(ip, port);

testnet.connect().then(() => {
  console.log(testnet.connection); // true if connection successful
  // we can now start using the API
  testnet.api('GetStats').then((result) => {
    console.log(result);
  });
});

