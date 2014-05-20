"use strict";

var Class               = require('ee-class');

var TransformingLoader  = require('./TransformingLoader'),
    transformers        = require('../transformer'),
    rewrites            = require('../rewrite');

var RewriteLoader = {

    inherits: TransformingLoader

    , init: function initialize(loader, classMapExtension){
        var map = this._createMap(classMapExtension),
            factory = new transformers.FactoryTransformer(map);

        initialize.super.call(this, factory, loader);
    }

    , _createMap: function(extension){
        var map = {
            alias:      rewrites.Alias
            , append:   rewrites.Append
            , ensure:   rewrites.Ensure
            , override: rewrites.Override
            , template: rewrites.Template
            , extend:   rewrites.Extend
            , path:     rewrites.Path
        };

        extension = extension || {};
        for(var name in extension){
            map[name] = extension[name];
        }
        return map;
    }
};

module.exports = new Class(RewriteLoader);