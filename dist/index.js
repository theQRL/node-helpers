"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("@babel/polyfill");

var grpc = require('@grpc/grpc-js');

var protoLoader = require('@grpc/proto-loader');

var _require = require('grpc-js-kit'),
    createClient = _require.createClient;

var _require2 = require('util'),
    promisify = _require2.promisify;

var tmp = require('tmp');

var fs = require('fs');

var util = require('util');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var PROTO_PATH = './src/qrlbase.proto';
var qrlClient = null;

var clientGetNodeInfo = function clientGetNodeInfo(client) {
  return new Promise(function (resolve, reject) {
    client.getNodeInfo({}, function (error, response) {
      if (error) {
        reject(error);
      }

      resolve(response);
    });
  });
};

function loadGrpcBaseProto(_x) {
  return _loadGrpcBaseProto.apply(this, arguments);
}

function _loadGrpcBaseProto() {
  _loadGrpcBaseProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(grpcEndpoint) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", protoLoader.load(PROTO_PATH, {}).then( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(packageDefinition) {
                var packageObject, client, res, qrlProtoFilePath;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        packageObject = grpc.loadPackageDefinition(packageDefinition);
                        _context.next = 3;
                        return new packageObject.qrl.Base(grpcEndpoint, grpc.credentials.createInsecure());

                      case 3:
                        client = _context.sent;
                        _context.next = 6;
                        return clientGetNodeInfo(client);

                      case 6:
                        res = _context.sent;
                        qrlProtoFilePath = tmp.fileSync({
                          mode: '0644',
                          prefix: 'qrl-',
                          postfix: '.proto'
                        }).name;
                        _context.next = 10;
                        return writeFile(qrlProtoFilePath, res.grpcProto).then(function (fsErr) {
                          if (fsErr) {
                            throw new TypeError('tmp filesystem error');
                          }
                        });

                      case 10:
                        return _context.abrupt("return", qrlProtoFilePath);

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x5) {
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
  return _loadGrpcBaseProto.apply(this, arguments);
}

function loadGrpcProto(_x2, _x3) {
  return _loadGrpcProto.apply(this, arguments);
}

function _loadGrpcProto() {
  _loadGrpcProto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(protofile, endpoint) {
    var options, packageDefinition, grpcObject, verified;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true
            };
            _context3.next = 3;
            return protoLoader.load(protofile, options);

          case 3:
            packageDefinition = _context3.sent;
            _context3.next = 6;
            return grpc.loadPackageDefinition(packageDefinition);

          case 6:
            grpcObject = _context3.sent;
            verified = true; // QRLPROTO_SHA256.forEach(value => {
            //   if (value.memoryHash === calculatedObjectHash) {
            //     verified = true
            //   }
            // })
            // If the grpc object shasum matches, establish the grpc connection.

            if (!verified) {
              _context3.next = 17;
              break;
            }

            _context3.prev = 9;
            qrlClient = createClient({
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
            return _context3.abrupt("return", qrlClient);

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](9);
            throw new TypeError(_context3.t0);

          case 17:
            console.log('Unable to verifty proto file - have hashes changed?'); // eslint-disable-line no-console

            throw new TypeError('Unable to verify proto file');

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[9, 14]]);
  }));
  return _loadGrpcProto.apply(this, arguments);
}

function makeClient(_x4) {
  return _makeClient.apply(this, arguments);
}

function _makeClient() {
  _makeClient = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(grpcEndpoint) {
    var proto, client;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return loadGrpcBaseProto(grpcEndpoint);

          case 2:
            proto = _context4.sent;
            _context4.next = 5;
            return loadGrpcProto(proto, grpcEndpoint);

          case 5:
            client = _context4.sent;
            return _context4.abrupt("return", client);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _makeClient.apply(this, arguments);
}

var QrlNode = /*#__PURE__*/function () {
  function QrlNode(ipAddress, port) {
    _classCallCheck(this, QrlNode);

    this.version = '1.0.0';
    this.ipAddress = ipAddress;
    this.port = port;
    this.connection = false;
    this.client = null;
  }

  _createClass(QrlNode, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.connection === false) {
          var client = makeClient("".concat(_this.ipAddress, ":").concat(_this.port));
          _this.connection = true;
          _this.client = client;
          resolve(client);
        }

        reject('Already connected... disconnect first or create a new connection');
      });
    }
  }]);

  return QrlNode;
}();

module.exports = QrlNode;
//# sourceMappingURL=index.js.map