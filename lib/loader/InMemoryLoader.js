"use strict";

var Class = require('ee-class');

var FilterLoader            = require('./FilterLoader'),
    Comparator              = require('../comparator');

var InMemoryLoader = {

    inherits: FilterLoader

    , init: function initialize(rules, comp){
        initialize.super.call(this, comp, {
            load: function(key, callback){
                callback(null, rules);
            }
        });
    }
};

module.exports = new Class(InMemoryLoader);