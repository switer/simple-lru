'use strict';

var DEFAULT_LRU_LENGTH = 10

function LRU(max) {
    this._caches = {}
    this._queue = []
    this.settings({
        max: max || DEFAULT_LRU_LENGTH
    })
}
var proto = LRU.prototype

proto.settings = function(conf) {
    if (conf.hasOwnProperty('max')) {
        this._max = conf.max
    }
    return this
}
proto.clear = function() {
    this._caches = {}
    this._queue = []
    return this
}
proto.set = function(key, value) {
    this._caches[key] = value
    // put to the queue if key has not exist
    if (!~this._queue.indexOf(key)) {
        // if the queue is overflow, remove the oldest item which on the rear of the queue
        if (this._queue.length == this._max) {
            var removedKey = this._queue.pop()
            delete this._caches[removedKey]
        }
        this._queue.unshift(key)
    }
    return this
}
proto.get = function(key) {
    var index = this._queue.indexOf(key)
    if (~index) {
        this._queue.splice(index, 1)
        // put to the head of the queue
        this._queue.unshift(key)
    }
    return this._caches[key]
}
proto.del = function(key) {
    var index = this._queue.indexOf(key)
    if (~index) {
        this._queue.splice(index, 1)
        delete this._caches[key]
    }
    return this
}
var _instance

/**
 *  A singleton LRU
 *  @param max {Object} the max length of the LRU, which can be used once when initial instance
 */
LRU.instance = function(max) {
    if (_instance) {
        return _instance
    }
    return (_instance = new LRU(max))
}

module.exports = LRU
