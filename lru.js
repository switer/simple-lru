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

/**
 *  LRU-Cache instance settings
 *  @param conf {Object}
 *      {
 *          max: Number // Max length of LRU-Cache, default is 10.
 *      }
 */
proto.settings = function(conf) {
    if (conf.hasOwnProperty('max')) {
        this._max = conf.max
    }
    return this
}
/**
 *  Clear all cache data of the instance
 */
proto.clear = function() {
    this._caches = {}
    this._queue = []
    return this
}

/**
 *  Set operation will not change priority of the item,
 *  but will put to the head when the first time set to LRU-Cache 
 */
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
/**
 *  Put to the head when access
 */
proto.get = function(key) {
    var index = this._queue.indexOf(key)
    if (~index && index != 0) {
        this._queue.splice(index, 1)
        // put to the head of the queue
        this._queue.unshift(key)
    }
    return this._caches[key]
}
/**
 *  Delete a item with specified key
 */
proto.del = function(key) {
    var index = this._queue.indexOf(key)
    if (~index) {
        this._queue.splice(index, 1)
        delete this._caches[key]
    }
    return this
}
/**
 *  Get latest item of the cache-queue
 */
proto.latest = function () {
    return this._queue[0] || null
}
/**
 *  Get data with specified key. It will not change item's priority
 */
proto.data = function (key) {
    return this._caches[key]
}

/**
 *  A singleton LRU
 *  @param max {Object} the max length of the LRU, which can be used once when initial instance
 */
var _instance
LRU.instance = function(max) {
    if (_instance) {
        return _instance
    }
    return (_instance = new LRU(max))
}

module.exports = LRU
