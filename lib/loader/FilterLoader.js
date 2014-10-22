"use strict";

var Class = require('ee-class'),
    Types = require('ee-types');

var Comparator = require('../comparator');

var FilterLoader = {

      _loader: null
    , _comparator: null
    , _loaderKeyFun: null
    , _filterKeyFun: null

    , init: function initialize(comparator, loader, options) {
        this._loader        = loader;
        this._comparator    = Comparator.createComparator(comparator);

        options = options || {};
        this._loaderKeyFun = options.prepareLoaderKey || null;
        this._filterKeyFun = options.prepareFilterKey || null;
    }

    , _prepareLoaderKey: function(key){
        return Types.function(this._loaderKeyFun)
            ? this._loaderKeyFun.call(null, key) : key;
    }

    , _prepareFilterKey: function(key){
        return Types.function(this._filterKeyFun)
            ? this._filterKeyFun.call(null, key) : key;
    }

    , load: function(key, callback){
        var loaderKey = this._prepareLoaderKey(key);

        this._loader.load(loaderKey, function(error, rules){

            if(error) return callback(error, null);
            var filtered = [];
            try {
                var filterKey = this._prepareFilterKey(key);
                filtered = rules.filter(function(current){
                    var result = this._comparator.call(null, filterKey, current);
                    return result === true;

                }.bind(this));
            } catch(err) {
                return callback(err, null);
            }
            callback(null, filtered);
        }.bind(this));
    }
};

module.exports = new Class(FilterLoader);