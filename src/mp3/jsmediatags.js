'use strict'

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  } else {
    obj[key] = value
  }
  return obj
}

var MediaFileReader = require('./MediaFileReader')

var XhrFileReader = require('./XhrFileReader')

var BlobFileReader = require('./BlobFileReader')

var ArrayFileReader = require('./ArrayFileReader')

var MediaTagReader = require('./MediaTagReader')

var ID3v1TagReader = require('./ID3v1TagReader')

var ID3v2TagReader = require('./ID3v2TagReader')

var MP4TagReader = require('./MP4TagReader')

var FLACTagReader = require('./FLACTagReader')

var mediaFileReaders = []
var mediaTagReaders = []

function read(location, callbacks) {
  new Reader(location).read(callbacks)
}

function isRangeValid(range, fileSize) {
  var invalidPositiveRange =
    range.offset >= 0 && range.offset + range.length >= fileSize
  var invalidNegativeRange =
    range.offset < 0 &&
    (-range.offset > fileSize || range.offset + range.length > 0)
  return !(invalidPositiveRange || invalidNegativeRange)
}

var Reader =
  /*#__PURE__*/
  (function() {
    function Reader(file) {
      _classCallCheck(this, Reader)

      _defineProperty(this, '_file', void 0)

      _defineProperty(this, '_tagsToRead', void 0)

      _defineProperty(this, '_fileReader', void 0)

      _defineProperty(this, '_tagReader', void 0)

      this._file = file
    }

    _createClass(Reader, [
      {
        key: 'setTagsToRead',
        value: function setTagsToRead(tagsToRead) {
          this._tagsToRead = tagsToRead
          return this
        }
      },
      {
        key: 'setFileReader',
        value: function setFileReader(fileReader) {
          this._fileReader = fileReader
          return this
        }
      },
      {
        key: 'setTagReader',
        value: function setTagReader(tagReader) {
          this._tagReader = tagReader
          return this
        }
      },
      {
        key: 'read',
        value: function read(callbacks) {
          var FileReader = this._getFileReader()

          var fileReader = new FileReader(this._file)
          var self = this
          fileReader.init({
            onSuccess: function onSuccess() {
              self._getTagReader(fileReader, {
                onSuccess: function onSuccess(TagReader) {
                  new TagReader(fileReader)
                    .setTagsToRead(self._tagsToRead)
                    .read(callbacks)
                },
                onError: callbacks.onError
              })
            },
            onError: callbacks.onError
          })
        }
      },
      {
        key: '_getFileReader',
        value: function _getFileReader() {
          if (this._fileReader) {
            return this._fileReader
          } else {
            return this._findFileReader()
          }
        }
      },
      {
        key: '_findFileReader',
        value: function _findFileReader() {
          for (var i = 0; i < mediaFileReaders.length; i++) {
            if (mediaFileReaders[i].canReadFile(this._file)) {
              return mediaFileReaders[i]
            }
          }

          throw new Error('No suitable file reader found for ' + this._file)
        }
      },
      {
        key: '_getTagReader',
        value: function _getTagReader(fileReader, callbacks) {
          if (this._tagReader) {
            var tagReader = this._tagReader
            setTimeout(function() {
              callbacks.onSuccess(tagReader)
            }, 1)
          } else {
            this._findTagReader(fileReader, callbacks)
          }
        }
      },
      {
        key: '_findTagReader',
        value: function _findTagReader(fileReader, callbacks) {
          // We don't want to make multiple fetches per tag reader to get the tag
          // identifier. The strategy here is to combine all the tag identifier
          // ranges into one and make a single fetch. This is particularly important
          // in file readers that have expensive loads like the XHR one.
          // However, with this strategy we run into the problem of loading the
          // entire file because tag identifiers might be at the start or end of
          // the file.
          // To get around this we divide the tag readers into two categories, the
          // ones that read their tag identifiers from the start of the file and the
          // ones that read from the end of the file.
          var tagReadersAtFileStart = []
          var tagReadersAtFileEnd = []
          var fileSize = fileReader.getSize()

          for (var i = 0; i < mediaTagReaders.length; i++) {
            var range = mediaTagReaders[i].getTagIdentifierByteRange()

            if (!isRangeValid(range, fileSize)) {
              continue
            }

            if (
              (range.offset >= 0 && range.offset < fileSize / 2) ||
              (range.offset < 0 && range.offset < -fileSize / 2)
            ) {
              tagReadersAtFileStart.push(mediaTagReaders[i])
            } else {
              tagReadersAtFileEnd.push(mediaTagReaders[i])
            }
          }

          var tagsLoaded = false
          var loadTagIdentifiersCallbacks = {
            onSuccess: function onSuccess() {
              if (!tagsLoaded) {
                // We're expecting to load two sets of tag identifiers. This flag
                // indicates when the first one has been loaded.
                tagsLoaded = true
                return
              }

              for (var i = 0; i < mediaTagReaders.length; i++) {
                var range = mediaTagReaders[i].getTagIdentifierByteRange()

                if (!isRangeValid(range, fileSize)) {
                  continue
                }

                try {
                  var tagIndentifier = fileReader.getBytesAt(
                    range.offset >= 0 ? range.offset : range.offset + fileSize,
                    range.length
                  )
                } catch (ex) {
                  if (callbacks.onError) {
                    callbacks.onError({
                      type: 'fileReader',
                      info: ex.message
                    })
                  }

                  return
                }

                if (mediaTagReaders[i].canReadTagFormat(tagIndentifier)) {
                  callbacks.onSuccess(mediaTagReaders[i])
                  return
                }
              }

              if (callbacks.onError) {
                callbacks.onError({
                  type: 'tagFormat',
                  info: 'No suitable tag reader found'
                })
              }
            },
            onError: callbacks.onError
          }

          this._loadTagIdentifierRanges(
            fileReader,
            tagReadersAtFileStart,
            loadTagIdentifiersCallbacks
          )

          this._loadTagIdentifierRanges(
            fileReader,
            tagReadersAtFileEnd,
            loadTagIdentifiersCallbacks
          )
        }
      },
      {
        key: '_loadTagIdentifierRanges',
        value: function _loadTagIdentifierRanges(
          fileReader,
          tagReaders,
          callbacks
        ) {
          if (tagReaders.length === 0) {
            // Force async
            setTimeout(callbacks.onSuccess, 1)
            return
          }

          var tagIdentifierRange = [Number.MAX_VALUE, 0]
          var fileSize = fileReader.getSize() // Create a super set of all ranges so we can load them all at once.
          // Might need to rethink this approach if there are tag ranges too far
          // a part from each other. We're good for now though.

          for (var i = 0; i < tagReaders.length; i++) {
            var range = tagReaders[i].getTagIdentifierByteRange()
            var start =
              range.offset >= 0 ? range.offset : range.offset + fileSize
            var end = start + range.length - 1
            tagIdentifierRange[0] = Math.min(start, tagIdentifierRange[0])
            tagIdentifierRange[1] = Math.max(end, tagIdentifierRange[1])
          }

          fileReader.loadRange(tagIdentifierRange, callbacks)
        }
      }
    ])

    return Reader
  })()

var Config =
  /*#__PURE__*/
  (function() {
    function Config() {
      _classCallCheck(this, Config)
    }

    _createClass(Config, null, [
      {
        key: 'addFileReader',
        value: function addFileReader(fileReader) {
          mediaFileReaders.push(fileReader)
          return Config
        }
      },
      {
        key: 'addTagReader',
        value: function addTagReader(tagReader) {
          mediaTagReaders.push(tagReader)
          return Config
        }
      },
      {
        key: 'removeTagReader',
        value: function removeTagReader(tagReader) {
          var tagReaderIx = mediaTagReaders.indexOf(tagReader)

          if (tagReaderIx >= 0) {
            mediaTagReaders.splice(tagReaderIx, 1)
          }

          return Config
        }
      },
      {
        key: 'EXPERIMENTAL_avoidHeadRequests',
        value: function EXPERIMENTAL_avoidHeadRequests() {
          XhrFileReader.setConfig({
            avoidHeadRequests: true
          })
        }
      },
      {
        key: 'setDisallowedXhrHeaders',
        value: function setDisallowedXhrHeaders(disallowedXhrHeaders) {
          XhrFileReader.setConfig({
            disallowedXhrHeaders: disallowedXhrHeaders
          })
        }
      },
      {
        key: 'setXhrTimeoutInSec',
        value: function setXhrTimeoutInSec(timeoutInSec) {
          XhrFileReader.setConfig({
            timeoutInSec: timeoutInSec
          })
        }
      }
    ])

    return Config
  })()

Config.addFileReader(XhrFileReader)
  .addFileReader(BlobFileReader)
  .addFileReader(ArrayFileReader)
  .addTagReader(ID3v2TagReader)
  .addTagReader(ID3v1TagReader)
  .addTagReader(MP4TagReader)
  .addTagReader(FLACTagReader)

if (typeof process !== 'undefined' && !process.browser) {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  } else {
    var NodeFileReader = require('./NodeFileReader')

    Config.addFileReader(NodeFileReader)
  }
}

module.exports = {
  read: read,
  Reader: Reader,
  Config: Config
}
