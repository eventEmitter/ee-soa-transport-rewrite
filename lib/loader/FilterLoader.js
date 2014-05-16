"use strict";

var Class = require('ee-class'),
    Types = require('ee-types');

var Comparator = require('../comparator');

var FilterLoader = {

    _loader: null
    , _comparator: null

    , init: function initialize(comparator, loader) {
        this._loader        = loader;
        this._comparator    = Comparator.createComparator(comparator);
    }

    , load: function(key, callback){
        this._loader.load(key, function(error, rules){

            if(error){
                return callback(error, null);
            }

            try {
                var filtered = rules.filter(function(current){

                    var result = this._comparator.call(null, key, current);
                    return result === true;

                }.bind(this));
                callback(null, filtered);
            } catch(err) {
                callback(err, null);
            }
        }.bind(this));
    }
};

module.exports = new Class(FilterLoader);