"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ByteArrayUtils = require('./ByteArrayUtils');

var bin = require('./ByteArrayUtils').bin;

var getInteger24 = require('./ByteArrayUtils').getInteger24;

var getInteger32 = require('./ByteArrayUtils').getInteger32;

var FLACTagContents =
/*#__PURE__*/
function () {
  function FLACTagContents(blocks) {
    _classCallCheck(this, FLACTagContents);

    _defineProperty(this, "_blocks", void 0);

    this._blocks = [];

    this._blocks.push(FLACTagContents.createStreamBlock());

    this._blocks = this._blocks.concat(blocks || []);
  }

  _createClass(FLACTagContents, [{
    key: "toArray",
    value: function toArray() {
      this._blocks[this._blocks.length - 1].setFinal();

      return this._blocks.reduce(function (array, block) {
        return array.concat(block.toArray());
      }, bin("fLaC"));
    }
  }], [{
    key: "createBlock",
    value: function createBlock(type, data) {
      return new MetadataBlock(type, data);
    }
  }, {
    key: "createStreamBlock",
    value: function createStreamBlock() {
      var data = [0x00, 0x00, 0x22].concat(Array(34).fill(0x00));
      return this.createBlock(0, data);
    }
  }, {
    key: "createCommentBlock",
    value: function createCommentBlock() {
      var length = 12;
      var byteArray = [];

      for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
        data[_key] = arguments[_key];
      }

      for (var i = 0; i < data.length; i++) {
        length += data[i][0].length + data[i][1].length + 5;
        byteArray = byteArray.concat(getInteger32(data[i][0].length + data[i][1].length + 1).reverse());
        var entry = data[i][0] + "=" + data[i][1];
        byteArray = byteArray.concat(bin(entry));
      }

      var array = [].concat(getInteger24(length), [0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], getInteger32(data.length).reverse(), byteArray);
      return this.createBlock(4, array);
    }
  }, {
    key: "createPictureBlock",
    value: function createPictureBlock() {
      var data = [].concat(getInteger24(45), getInteger32(3), getInteger32(10), bin("image/jpeg"), getInteger32(9), bin("A Picture"), Array(16).fill(0x00), getInteger32(4), bin("data"));
      return this.createBlock(6, data);
    }
  }]);

  return FLACTagContents;
}();

var MetadataBlock =
/*#__PURE__*/
function () {
  function MetadataBlock(type, data) {
    _classCallCheck(this, MetadataBlock);

    _defineProperty(this, "_data", void 0);

    _defineProperty(this, "_final", void 0);

    _defineProperty(this, "_type", void 0);

    this._type = type;
    this._data = data;
    this._final = false;
  }

  _createClass(MetadataBlock, [{
    key: "setFinal",
    value: function setFinal() {
      this._final = true;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return [this._type + (this._final ? 128 : 0)].concat(this._data);
    }
  }]);

  return MetadataBlock;
}();

module.exports = FLACTagContents;