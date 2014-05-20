"use strict";

var Class = require('ee-class');

var TransformingLoader = {

    _transformer:   null
    , _loader:      null

    , transformer: {
        get: function(){
            return this._transformer;
        }
    }

    , loader: {
        get: function(){
            return this._loader;
        }
    }

    , init: function(transformer, loader){
        this._transformer   = transformer;
        this._loader        = loader;
    }

    , load: function(key, callback){
        this._load(key, function(err, result){
            if(err){
                return callback(err, null);
            }
            this._transform(key, result, callback);
        }.bind(this));
    }

    , _transform: function(key, result, callback){
        return this.transformer.transform(key, result, callback);
    }

    , _load: function(key, callback){
        this.loader.load(key, callback);
    }
};

module.exports = new Class(TransformingLoader);