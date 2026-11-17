const QrlNode = require('./dist/index.js')

async function main() {
  const node = new QrlNode('testnet-1.automated.theqrl.org', 19009)
  try {
    if (!(await node.connect())) throw new Error('Node supplied an unapproved proto')
    console.log(await node.api('GetStats'))
  } finally {
    node.disconnect()
  }
}

main().catch(console.error)
