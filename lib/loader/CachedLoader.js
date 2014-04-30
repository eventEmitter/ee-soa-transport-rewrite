"use strict";

var Class = require('ee-class');

var CachedLoader = {

    _cache:     null
    , _loader:  null

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
    , load: function(host, callback){

        if(this.cache.has(host)){
            callback(null, this.cache.get(host));
            return;
        }

        this.loader.load(host, function(err, rules){
            if(err){
                callback(err, null);
                return;
            }
            this.cache.set(host, rules);
            callback(err, rules);
        }.bind(this));
    }
};

module.exports = new Class(CachedLoader);