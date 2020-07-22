"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("@babel/polyfill");

var grpc = require('@grpc/grpc-js');

var protoLoader = require('@grpc/proto-loader');

var CryptoJS = require('crypto-js');

var _require = require('grpc-js-kit'),
    createClient = _require.createClient;

var _require2 = require('util'),
    promisify = _require2.promisify;

var _require3 = require('@theqrl/qrl-proto-sha256'),
    QRLPROTO_SHA256 = _require3.QRLPROTO_SHA256;

var tmp = require('tmp');

var fs = require('fs');

var util = require('util');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);

var dns = require('dns').promises;

var PROTO_PATH = 'node_modules/@theqrl/qrlbase.proto/qrlbase.proto';
var qrlClient = null;

function clientGetNodeInfo(_x) {
  return _clientGetNodeInfo.apply(this, arguments);
}

function _clientGetNodeInfo() {
  _clientGetNodeInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(client) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(resolve, reject) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return client.getNodeInfo({}, function (error, response) {
                          if (error) {
                            throw new Error(error);
                          }

                          resolve(response);
                        });

                      case 3:
                        _context6.next = 8;
                        break;

                      case 5:
                        _context6.prev = 5;
                        _context6.t0 = _context6["catch"](0);
                        throw new Error(_context6.t0);

                      case 8:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, null, [[0, 5]]);
              }));

              return function (_x15, _x16) {
                return _ref4.apply(this, arguments);
              };
            }())["catch"](function (error) {
              throw new Error('Unable to get valid proto file (' + error + ')');
            }));

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _clientGetNodeInfo.apply(this, arguments);
}

function checkProtoHash(_x2) {
  return _checkProtoHash.apply(this, arguments);
}

function _checkProtoHash() {
  _checkProtoHash = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(file) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", readFile(file).then( /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(contents) {
                var protoFileWordArray, calculatedProtoHash, verified;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        protoFileWordArray = CryptoJS.lib.WordArray.create(contents.toString());
                        calculatedProtoHash = CryptoJS.SHA256(protoFileWordArray).toString(CryptoJS.enc.Hex);
                        verified = false;
                        QRLPROTO_SHA256.forEach(function (value) {
                          if (value.protoHash) {
                            if (value.protoHash === calculatedProtoHash) {
                              verified = true;
                            }
                          }
                        });
                        return _context8.abrupt("return", verified);

                      case 5:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x17) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _checkProtoHash.apply(this, arguments);
}

function loadGrpcBaseProto(_x3) {
  return _loadGrpcBaseProto.apply(this, arguments);
}

function _loadGrpcBaseProto() {
  _loadGrpcBaseProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(grpcEndpoint) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt("return", new Promise(function (resolve, reject) {
              return protoLoader.load(PROTO_PATH, {}).then( /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(packageDefinition) {
                  var packageObject, client, res, qrlProtoFilePath;
                  return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          _context10.prev = 0;
                          packageObject = grpc.loadPackageDefinition(packageDefinition);
                          _context10.next = 4;
                          return new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure());

                        case 4:
                          client = _context10.sent;
                          _context10.next = 7;
                          return clientGetNodeInfo(client);

                        case 7:
                          res = _context10.sent;
                          qrlProtoFilePath = tmp.fileSync({
                            mode: '0644',
                            prefix: 'qrl-',
                            postfix: '.proto'
                          }).name;
                          _context10.next = 11;
                          return writeFile(qrlProtoFilePath, res.grpcProto).then(function (fsErr) {
                            if (fsErr) {
                              reject('tmp filesystem error');
                            }
                          })["catch"](function (error) {// throw new Error('Unable to load grpc base proto (' + error + ')')
                          });

                        case 11:
                          resolve(qrlProtoFilePath);
                          _context10.next = 17;
                          break;

                        case 14:
                          _context10.prev = 14;
                          _context10.t0 = _context10["catch"](0);
                          throw new Error('Unable to load grpc base proto (' + _context10.t0 + ')');

                        case 17:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10, null, [[0, 14]]);
                }));

                return function (_x18) {
                  return _ref6.apply(this, arguments);
                };
              }());
            })["catch"](function (error) {
              throw new Error('Unable to load grpc base proto (' + error + ')');
            }));

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _loadGrpcBaseProto.apply(this, arguments);
}

function loadGrpcProto(_x4, _x5) {
  return _loadGrpcProto.apply(this, arguments);
}

function _loadGrpcProto() {
  _loadGrpcProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(protofile, endpoint) {
    var options, packageDefinition, grpcObject, grpcObjectString, protoObjectWordArray, calculatedObjectHash, verified;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            options = {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            };
            _context12.next = 4;
            return protoLoader.load(protofile, options);

          case 4:
            packageDefinition = _context12.sent;
            _context12.next = 7;
            return grpc.loadPackageDefinition(packageDefinition);

          case 7:
            grpcObject = _context12.sent;
            grpcObjectString = JSON.stringify(grpcObject.qrl);
            protoObjectWordArray = CryptoJS.lib.WordArray.create(grpcObjectString);
            calculatedObjectHash = CryptoJS.SHA256(protoObjectWordArray).toString(CryptoJS.enc.Hex);
            verified = false;
            QRLPROTO_SHA256.forEach(function (value) {
              if (value.objectHash) {
                if (value.objectHash === calculatedObjectHash) {
                  verified = true;
                }
              }
            }); // If the grpc object shasum matches, establish the grpc connection.

            if (!verified) {
              _context12.next = 18;
              break;
            }

            _context12.next = 16;
            return createClient({
              protoPath: protofile,
              packageName: 'qrl',
              serviceName: 'PublicAPI',
              options: {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
              }
            }, endpoint);

          case 16:
            qrlClient = _context12.sent;
            return _context12.abrupt("return", qrlClient);

          case 18:
            _context12.next = 23;
            break;

          case 20:
            _context12.prev = 20;
            _context12.t0 = _context12["catch"](0);
            throw new Error('Unable to load grpc proto file (' + _context12.t0 + ')');

          case 23:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 20]]);
  }));
  return _loadGrpcProto.apply(this, arguments);
}

function makeClient(_x6) {
  return _makeClient.apply(this, arguments);
}

function _makeClient() {
  _makeClient = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(grpcEndpoint) {
    var proto, validHash, client;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return loadGrpcBaseProto(grpcEndpoint);

          case 3:
            proto = _context13.sent;
            _context13.next = 6;
            return checkProtoHash(proto);

          case 6:
            validHash = _context13.sent;

            if (!validHash) {
              _context13.next = 12;
              break;
            }

            _context13.next = 10;
            return loadGrpcProto(proto, grpcEndpoint);

          case 10:
            client = _context13.sent;
            return _context13.abrupt("return", client);

          case 12:
            return _context13.abrupt("return", null);

          case 15:
            _context13.prev = 15;
            _context13.t0 = _context13["catch"](0);
            throw new Error('Unable to make client (' + _context13.t0 + ')');

          case 18:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 15]]);
  }));
  return _makeClient.apply(this, arguments);
}

function validate(_x7) {
  return _validate.apply(this, arguments);
}

function _validate() {
  _validate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(node) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt("return", dns.lookup(node));

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _validate.apply(this, arguments);
}

var QrlNode = /*#__PURE__*/function () {
  function QrlNode(ipAddress, port) {
    _classCallCheck(this, QrlNode);

    this.version = '0.5.2';
    this.connection = false;
    this.client = null;
    this.ipAddress = ipAddress;
    this.port = port;
    validate(ipAddress).then(function (err, res) {
      if (err) {
        return false;
      }

      return true;
    })["catch"](function (error) {
      console.log(error);
    });
  }

  _createClass(QrlNode, [{
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                    var client;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!(_this.connection === false)) {
                              _context.next = 7;
                              break;
                            }

                            _context.next = 3;
                            return makeClient("".concat(_this.ipAddress, ":").concat(_this.port));

                          case 3:
                            client = _context.sent;
                            _this.connection = true;
                            _this.client = client;
                            resolve(client);

                          case 7:
                            reject('Already connected... disconnect first or create a new connection');

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x8, _x9) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.client = null;
      this.connection = false;
    }
  }, {
    key: "validApi",
    value: function () {
      var _validApi = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(apiCall) {
        var client;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.client;

              case 2:
                client = _context3.sent;
                _context3.prev = 3;

                if (!(client[apiCall].path.substr(0, 5) === '/qrl.')) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", true);

              case 6:
                return _context3.abrupt("return", false);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](3);
                return _context3.abrupt("return", false);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 9]]);
      }));

      function validApi(_x10) {
        return _validApi.apply(this, arguments);
      }

      return validApi;
    }()
  }, {
    key: "api",
    value: function api(apiCall) {
      var _this2 = this;

      var request = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Promise( /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve, reject) {
          var client;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return _this2.client;

                case 2:
                  client = _context5.sent;
                  client[apiCall](request, /*#__PURE__*/function () {
                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(error, response) {
                      return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (error) {
                                reject(error);
                              }

                              resolve(response);

                            case 2:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4);
                    }));

                    return function (_x13, _x14) {
                      return _ref3.apply(this, arguments);
                    };
                  }());

                case 4:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x11, _x12) {
          return _ref2.apply(this, arguments);
        };
      }())["catch"](function (error) {
        throw new Error('Unable to make API call (' + error + ')');
      });
    }
  }]);

  return QrlNode;
}();

module.exports = QrlNode;
//# sourceMappingURL=index.js.map