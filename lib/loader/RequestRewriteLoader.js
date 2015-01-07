"use strict";

var Class = require('ee-class'),
    Types = require('ee-types');

var FilterLoader = require('./FilterLoader');

var RequestRewriteLoader = module.exports = new Class({

      inherits : FilterLoader

    , init: function initialize(loader, options) {
        var comp = function(pathname, rule){
            if(!('path' in rule)){
                throw new Error('Malformed rule, field path is missing.');
            }

            var path = rule.path;
            if(Types.regexp(path)){
                var result = pathname.match(path);
                pathname.lastIndex = 0;
                return !Types.null(result);
            }

            return path === '*' || path === pathname || path === null;
        };

        initialize.super.call(this, comp, loader, options);
    }

    , _prepareLoaderKey: function(request){
        return request.hostname;
    }

    , _prepareFilterKey: function(request){
        return request.pathname;
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
});