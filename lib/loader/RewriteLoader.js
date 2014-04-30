"use strict";

var Class               = require('ee-class'),
    TransformingLoader  = require('./TransformingLoader');

var rewrites            = require('../rewrite');

var RewriteLoader = {

    inherits: TransformingLoader

    , _map: null

    , init: function initialize(loader, classMapExtension){
        initialize.super.call(this, this, loader);
        this._map = this._createMap(classMapExtension);
    }

    , _createMap: function(extension){
        var map = {
            alias:      rewrites.Alias
            , append:   rewrites.Append
            , ensure:   rewrites.Ensure
            , override: rewrites.Override
        };

        extension = extension || {};
        for(var name in extension){
            map[name] = extension[name];
        }
        return map;
    }

    , _transform: function(key, result, callback){
        var len = result.length;
        var last = null;
        for(var i=0;i<len;i++){
            var rule = result[i];
            var rew = this._createInstance(rule);
            if(last === null){
                last = rew;
            } else {
                last.then(rew);
            }
        }
        callback(null, last);
    }

    , _createInstance: function(rule){
        var mapped = this._map[rule.name];
        if(!(rule.name in this._map)){
            mapped = rewrites.Rewrite;
        }
        return new mapped(rule.domain, rule.field, rule.value, rule.priority, this);
    }
};

module.exports = new Class(RewriteLoader);