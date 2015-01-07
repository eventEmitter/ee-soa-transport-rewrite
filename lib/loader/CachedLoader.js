"use strict";

var Class = require('ee-class');

var CachedLoader = module.exports = new Class({

      _cache    : null
    , _loader   : null

    , cache: {
        get: function(){ return this._cache; }
    }

    , loader: {
        get: function(){ return this._loader; }
    }

    , init: function initialize(cache, loader) {
        this._cache = cache;
        this._loader = loader;
    }

    /**
     * todo: check if the loader should fill empty results into the cache
     *
     * @param host
     * @param callback
     */
    , load: function(key, callback){

        if(this.cache.has(key)) return callback(null, this.cache.get(key));

        this.loader.load(key, function(err, rules){
            if(err){
                return callback(err, null);
            }
            this.cache.set(key, rules);
            callback(err, rules);
        }.bind(this));
    }
});