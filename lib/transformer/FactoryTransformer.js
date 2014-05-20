"use strict";

var Class               = require('ee-class');

var rewrites            = require('../rewrite');

var FactoryTransformer = {

      _map: null

    , init: function initialize(classMap){
        this._map = classMap;
    }

    , transform: function(key, result, callback){
        var last = null;

        result.forEach(function(current){
            var rewrite = this._createInstance(current);
            if(last === null){
                last = rewrite;
            } else {
                last.then(rewrite);
            }
        }.bind(this));

        callback(null, last);
    }

    , _createInstance: function(rule){
        var mapped = this._map[rule.name];
        if(!(rule.name in this._map)){
            mapped = rewrites.Rewrite;
        }
        return new mapped(rule, this);
    }
};

module.exports = new Class(FactoryTransformer);