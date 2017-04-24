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
              append:       rewrites.Append
            , ensure:       rewrites.Ensure
            , extend:       rewrites.Extend
            , method:       rewrites.Method
            , option:       rewrites.Option
            , override:     rewrites.Override
            , parameter:    rewrites.Parameter
            , path:         rewrites.Path
            , redirect:     rewrites.Redirect
            , template:     rewrites.Template
        };

        extension = extension || {};
        for(var name in extension){
            map[name] = extension[name];
        }
        return map;
    }
};

module.exports = new Class(RewriteLoader);