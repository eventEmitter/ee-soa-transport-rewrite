"use strict";

var Class = require('ee-class');

var TransformingLoader      = require('./TransformingLoader'),
    transformers            = require('../transformer');

var InMemoryLoader = {

    inherits: TransformingLoader

    , init : function initialize(rules, comp){
        comp = comp || 'key';
        var transformer = new transformers.FilterTransformer(comp);

        initialize.super.call(this, transformer, {
            load: function(key, callback){
                return callback(null, rules);
            }
        });

    }
};

module.exports = new Class(InMemoryLoader);