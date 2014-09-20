'use strict';

var _            = require('underscore');
var EventEmitter = require('events').EventEmitter;
var merge        = require('react/lib/merge');
var shallowEqual = require('react/lib/shallowEqual');
var CHANGE_EVENT = 'change';

var StoreUtils = {
  createStore: function(spec) {
    var store = merge(EventEmitter.prototype, merge(spec, {
      emitChange: function() {
        this.emit(CHANGE_EVENT);
      },

      addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
      }
    }));

    _.each(store, function (val, key) {
      if (_.isFunction(val)) {
        store[key] = store[key].bind(store);
      }
    });

    store.setMaxListeners(0);
    return store;
  },

  isInBag: function(bag, id, fields) {
    var item = bag[id];

    if (!bag[id]) {
      return false;
    }

    if (fields) {
      return fields.every(function(field) {
        item.hasOwnProperty(field);
      });
    } else {
      return true;
    }
  },

  mergeIntoBag: function(bag, entities, transform) {
    var key;

    if (!transform) {
      transform = function(x) {
        return x;
      };
    }

    for (key in entities) {
      if (!entities.hasOwnProperty(key)) {
        continue;
      }

      if (!bag.hasOwnProperty(key)) {
        bag[key] = transform(entities[key]);
      } else if (!shallowEqual(bag[key], entities[key])) {
        bag[key] = transform(merge(bag[key], entities[key]));
      }
    }
  }
};

module.exports = StoreUtils;