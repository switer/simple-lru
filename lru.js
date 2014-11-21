'use strict';


var caches = {}
var queue = []
var LUR = {
    settings: function (max) {
        this._max = max
        return this
    },
    clear: function () {
        caches = {}
        queue = []
    },
    set: function (key, value) {
        caches[key] = value
        if (!~queue.indexOf(key)) {
            if (queue.length == this._max) {
                var removedKey = queue.pop()
                delete caches[removedKey]
            }
            queue.unshift(key)
        }
        return this
    },
    get: function (key) {
        var index = queue.indexOf(key)
        if (~index) {
            queue.splice(index, 1)
            queue.unshift(key)
        }
        return caches[key]
    },
    del: function (key) {
        var index = queue.indexOf(key)
        if (~index) {
            queue.splice(index, 1)
            delete caches[key]
        }
        return this
    }
}

module.exports = LUR