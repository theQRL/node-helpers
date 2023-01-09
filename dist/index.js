"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
require('@babel/polyfill');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var CryptoJS = require('crypto-js');
var _require = require('util'),
  promisify = _require.promisify;
var _require2 = require('@theqrl/qrl-proto-sha256'),
  QRLPROTO_SHA256 = _require2.QRLPROTO_SHA256;
var tmp = require('tmp');
var fs = require('fs');
var util = require('util');
var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var PROTO_PATH = __dirname + '/../node_modules/@theqrl/qrlbase.proto/qrlbase.proto';
if (__dirname.includes('/node_modules/')) {
  PROTO_PATH = __dirname + '/../../qrlbase.proto/qrlbase.proto';
}
var GOOGLE_PATH = __dirname + '/../node_modules/google-proto-files/';
if (__dirname.includes('/node_modules/')) {
  GOOGLE_PATH = __dirname + '/../../../google-proto-files/';
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
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(packageDefinition) {
      var packageObject, client, res, qrlProtoFilePath;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
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
  _loadGrpcProto = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(protofile, endpoint) {
    var options, packageDefinition, grpcObject, grpcObjectString, protoObjectWordArray, calculatedObjectHash, verified;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          options = {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: [GOOGLE_PATH]
          };
          _context7.next = 3;
          return protoLoader.load(protofile, options);
        case 3:
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
          });
          // If the grpc object shasum matches, establish the grpc connection.
          if (!verified) {
            _context7.next = 12;
            break;
          }
          return _context7.abrupt("return", new grpcObject.qrl.PublicAPI(endpoint, grpc.credentials.createInsecure()));
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _loadGrpcProto.apply(this, arguments);
}
function makeClient(_x4) {
  return _makeClient.apply(this, arguments);
}
function _makeClient() {
  _makeClient = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(grpcEndpoint) {
    var proto, validHash, client;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return loadGrpcBaseProto(grpcEndpoint);
        case 2:
          proto = _context8.sent;
          if (!proto) {
            _context8.next = 12;
            break;
          }
          _context8.next = 6;
          return checkProtoHash(proto);
        case 6:
          validHash = _context8.sent;
          if (!validHash) {
            _context8.next = 12;
            break;
          }
          _context8.next = 10;
          return loadGrpcProto(proto, grpcEndpoint);
        case 10:
          client = _context8.sent;
          return _context8.abrupt("return", client);
        case 12:
          return _context8.abrupt("return", null);
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _makeClient.apply(this, arguments);
}
var QrlNode = /*#__PURE__*/function () {
  function QrlNode(ipAddress, port) {
    _classCallCheck(this, QrlNode);
    this.version = '0.7.2';
    this.connection = false;
    this.client = null;
    this.ipAddress = ipAddress;
    this.port = port;
  }
  _createClass(QrlNode, [{
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var client;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(this.connection === false)) {
                _context2.next = 7;
                break;
              }
              _context2.next = 3;
              return makeClient("".concat(this.ipAddress, ":").concat(this.port));
            case 3:
              client = _context2.sent;
              if (client === null) {
                this.connection = false;
              } else {
                this.connection = true;
              }
              this.client = client;
              return _context2.abrupt("return", client);
            case 7:
              throw new Error('Already connected');
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
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
      var _validApi = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(apiCall) {
        var client;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
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
        }, _callee3, this, [[0, 9]]);
      }));
      function validApi(_x5) {
        return _validApi.apply(this, arguments);
      }
      return validApi;
    }()
  }, {
    key: "api",
    value: function () {
      var _api = _asyncToGenerator(function (apiCall) {
        var _this = this;
        var request = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                return _context6.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(resolve, reject) {
                    var client;
                    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                      while (1) switch (_context5.prev = _context5.next) {
                        case 0:
                          _context5.next = 2;
                          return _this.client;
                        case 2:
                          client = _context5.sent;
                          client[apiCall](request, /*#__PURE__*/function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(error, response) {
                              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                                while (1) switch (_context4.prev = _context4.next) {
                                  case 0:
                                    if (error) {
                                      reject(error);
                                    }
                                    resolve(response);
                                  case 2:
                                  case "end":
                                    return _context4.stop();
                                }
                              }, _callee4);
                            }));
                            return function (_x9, _x10) {
                              return _ref3.apply(this, arguments);
                            };
                          }());
                        case 4:
                        case "end":
                          return _context5.stop();
                      }
                    }, _callee5);
                  }));
                  return function (_x7, _x8) {
                    return _ref2.apply(this, arguments);
                  };
                }()));
              case 4:
                _context6.prev = 4;
                _context6.t0 = _context6["catch"](0);
                console.log('Unable to make API call (' + _context6.t0 + ')');
              case 7:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[0, 4]]);
        })();
      });
      function api(_x6) {
        return _api.apply(this, arguments);
      }
      return api;
    }()
  }]);
  return QrlNode;
}();
module.exports = QrlNode;
//# sourceMappingURL=index.js.map