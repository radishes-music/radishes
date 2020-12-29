'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require('fs');

var ChunkedFileData = require('./ChunkedFileData');

var MediaFileReader = require('./MediaFileReader');

var NodeFileReader =
/*#__PURE__*/
function (_MediaFileReader) {
  _inherits(NodeFileReader, _MediaFileReader);

  function NodeFileReader(path) {
    var _this;

    _classCallCheck(this, NodeFileReader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeFileReader).call(this));

    _defineProperty(_assertThisInitialized(_this), "_path", void 0);

    _defineProperty(_assertThisInitialized(_this), "_fileData", void 0);

    _this._path = path;
    _this._fileData = new ChunkedFileData();
    return _this;
  }

  _createClass(NodeFileReader, [{
    key: "getByteAt",
    value: function getByteAt(offset) {
      return this._fileData.getByteAt(offset);
    }
  }, {
    key: "_init",
    value: function _init(callbacks) {
      var self = this;
      fs.stat(self._path, function (err, stats) {
        if (err) {
          if (callbacks.onError) {
            callbacks.onError({
              "type": "fs",
              "info": err
            });
          }
        } else {
          self._size = stats.size;
          callbacks.onSuccess();
        }
      });
    }
  }, {
    key: "loadRange",
    value: function loadRange(range, callbacks) {
      var fd = -1;
      var self = this;
      var fileData = this._fileData;
      var length = range[1] - range[0] + 1;
      var onSuccess = callbacks.onSuccess;

      var onError = callbacks.onError || function (object) {};

      if (fileData.hasDataRange(range[0], range[1])) {
        process.nextTick(onSuccess);
        return;
      }

      var readData = function readData(err, _fd) {
        if (err) {
          onError({
            "type": "fs",
            "info": err
          });
          return;
        }

        fd = _fd; // TODO: Should create a pool of Buffer objects across all instances of
        //       NodeFileReader. This is fine for now.

        var buffer = new Buffer(length);
        fs.read(_fd, buffer, 0, length, range[0], processData);
      };

      var processData = function processData(err, bytesRead, buffer) {
        fs.close(fd, function (err) {
          if (err) {
            console.error(err);
          }
        });

        if (err) {
          onError({
            "type": "fs",
            "info": err
          });
          return;
        }

        storeBuffer(buffer);
        onSuccess();
      };

      var storeBuffer = function storeBuffer(buffer) {
        var data = Array.prototype.slice.call(buffer, 0, length);
        fileData.addData(range[0], data);
      };

      fs.open(this._path, "r", undefined, readData);
    }
  }], [{
    key: "canReadFile",
    value: function canReadFile(file) {
      return typeof file === 'string' && !/^[a-z]+:\/\//i.test(file);
    }
  }]);

  return NodeFileReader;
}(MediaFileReader);

module.exports = NodeFileReader;