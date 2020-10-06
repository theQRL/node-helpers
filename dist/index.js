"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('@babel/polyfill');

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
var PROTO_PATH = __dirname + '/../node_modules/@theqrl/qrlbase.proto/qrlbase.proto';

if (__dirname.includes('/node_modules/')) {
  PROTO_PATH = __dirname + '/../../qrlbase.proto/qrlbase.proto';
}

var qrlClient = null;

function clientGetNodeInfo(client) {
  try {
    return new Promise(function (resolve, reject) {
      client.getNodeInfo({}, function (error, response) {
        if (error) {
          reject(error);
        }

        resolve(response);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function checkProtoHash(file) {
  return readFile(file).then(function (contents) {
    // console.log(contents)
    var protoFileWordArray = CryptoJS.lib.WordArray.create(contents.toString());
    var calculatedProtoHash = CryptoJS.SHA256(protoFileWordArray).toString(CryptoJS.enc.Hex);
    var verified = false;
    QRLPROTO_SHA256.forEach(function (value) {
      if (value.protoHash) {
        if (value.protoHash === calculatedProtoHash) {
          verified = true;
        }
      }
    });
    return verified;
  });
}

function loadGrpcBaseProto(grpcEndpoint) {
  return protoLoader.load(PROTO_PATH, {}).then( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(packageDefinition) {
      var packageObject, client, res, qrlProtoFilePath;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return grpc.loadPackageDefinition(packageDefinition);

            case 3:
              packageObject = _context.sent;
              _context.next = 6;
              return new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure());

            case 6:
              client = _context.sent;
              _context.next = 9;
              return clientGetNodeInfo(client);

            case 9:
              res = _context.sent;
              qrlProtoFilePath = tmp.fileSync({
                mode: '0644',
                prefix: 'qrl-',
                postfix: '.proto'
              }).name;
              writeFile(qrlProtoFilePath, res.grpcProto).then(function (fsErr) {
                if (fsErr) {
                  console.log('tmp filesystem error');
                }
              });
              return _context.abrupt("return", qrlProtoFilePath);

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              console.log('Unable to load grpc base proto (' + _context.t0 + ')');

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 15]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}

function loadGrpcProto(_x2, _x3) {
  return _loadGrpcProto.apply(this, arguments);
}

function _loadGrpcProto() {
  _loadGrpcProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(protofile, endpoint) {
    var options, packageDefinition, grpcObject, grpcObjectString, protoObjectWordArray, calculatedObjectHash, verified;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            options = {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            };
            _context7.next = 4;
            return protoLoader.load(protofile, options);

          case 4:
            packageDefinition = _context7.sent;
            grpcObject = grpc.loadPackageDefinition(packageDefinition);
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
              _context7.next = 16;
              break;
            }

            _context7.next = 14;
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

          case 14:
            qrlClient = _context7.sent;
            return _context7.abrupt("return", qrlClient);

          case 16:
            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t0 = _context7["catch"](0);
            console.log('Unable to load grpc proto file (' + _context7.t0 + ')');

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 18]]);
  }));
  return _loadGrpcProto.apply(this, arguments);
}

function makeClient(_x4) {
  return _makeClient.apply(this, arguments);
}

function _makeClient() {
  _makeClient = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(grpcEndpoint) {
    var proto, validHash, client;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return loadGrpcBaseProto(grpcEndpoint);

          case 3:
            proto = _context8.sent;

            if (!proto) {
              _context8.next = 13;
              break;
            }

            _context8.next = 7;
            return checkProtoHash(proto);

          case 7:
            validHash = _context8.sent;

            if (!validHash) {
              _context8.next = 13;
              break;
            }

            _context8.next = 11;
            return loadGrpcProto(proto, grpcEndpoint);

          case 11:
            client = _context8.sent;
            return _context8.abrupt("return", client);

          case 13:
            return _context8.abrupt("return", null);

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](0);
            console.log('Unable to make client (' + _context8.t0 + ')');

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 16]]);
  }));
  return _makeClient.apply(this, arguments);
}

var QrlNode = /*#__PURE__*/function () {
  function QrlNode(ipAddress, port) {
    _classCallCheck(this, QrlNode);

    this.version = '0.5.4';
    this.connection = false;
    this.client = null;
    this.ipAddress = ipAddress;
    this.port = port;
  }

  _createClass(QrlNode, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      try {
        return new Promise( /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
            var client;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(_this.connection === false)) {
                      _context2.next = 7;
                      break;
                    }

                    _context2.next = 3;
                    return makeClient("".concat(_this.ipAddress, ":").concat(_this.port));

                  case 3:
                    client = _context2.sent;

                    if (client === null) {
                      _this.connection = false;
                    } else {
                      _this.connection = true;
                    }

                    _this.client = client;
                    resolve(client);

                  case 7:
                    reject('Already connected... disconnect first or create a new connection');

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function (_x5, _x6) {
            return _ref2.apply(this, arguments);
          };
        }());
      } catch (error) {
        console.log(error);
      }
    }
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
                _context3.prev = 0;
                _context3.next = 3;
                return this.client;

              case 3:
                client = _context3.sent;

                if (!(client[apiCall].path.substr(0, 5) === '/qrl.')) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", true);

              case 6:
                return _context3.abrupt("return", false);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", false);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 9]]);
      }));

      function validApi(_x7) {
        return _validApi.apply(this, arguments);
      }

      return validApi;
    }()
  }, {
    key: "api",
    value: function () {
      var _api = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(apiCall) {
        var _this2 = this;

        var request,
            _args6 = arguments;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                request = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                _context6.prev = 1;
                return _context6.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve, reject) {
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
                              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(error, response) {
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

                              return function (_x11, _x12) {
                                return _ref4.apply(this, arguments);
                              };
                            }());

                          case 4:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x9, _x10) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 5:
                _context6.prev = 5;
                _context6.t0 = _context6["catch"](1);
                console.log('Unable to make API call (' + _context6.t0 + ')');

              case 8:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[1, 5]]);
      }));

      function api(_x8) {
        return _api.apply(this, arguments);
      }

      return api;
    }()
  }]);

  return QrlNode;
}();

module.exports = QrlNode;
//# sourceMappingURL=index.js.map