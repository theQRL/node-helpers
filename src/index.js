class QrlNode {
  constructor(ipAddress, port) {
    this.version = '1.0.0'
    this.ipAddress = ipAddress
    this.port = port
  }
  /*
   * version: reports current version
   */
  versionOld() {
    return '1.0.0'
  }
}
module.exports = QrlNode
