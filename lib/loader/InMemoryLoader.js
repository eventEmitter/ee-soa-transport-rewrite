"use strict";

var Class = require('ee-class');

var TransformingLoader      = require('./TransformingLoader'),
    FilterLoader            = require('./FilterLoader'),
    transformers            = require('../transformer'),
    Comparator              = require('../comparator');

var InMemoryLoader = {

    /*inherits: TransformingLoader

    , init : function initialize(rules, comp){
        comp = comp || 'key';
        var transformer = new transformers.FilterTransformer(comp);

        initialize.super.call(this, transformer, {
            load: function(key, callback){
                return callback(null, rules);
            }
        });
    }*/
    inherits: FilterLoader
    , init: function initialize(rules, comp){
        var comparator = Comparator.createComparator(comp);
        initialize.super.call(this, comp, {
            load: function(key, callback){
                callback(null, rules);
            }
        });
    }
};

module.exports = new Class(InMemoryLoader);