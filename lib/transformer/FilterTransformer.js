"use strict";

var Class = require('ee-class'),
    Types = require('ee-types');

var FilterTransformer = {

    comparator: null

    , init: function(comp){
        this.comparator = (Types.string(comp))
            ? this._createComparator(comp)
            : comp;
    }

    , _createComparator: function(field){
        return function(key, current){
            if(!(field in current)){
                return null;
            }
            return current[field] == key;
        };
    }

    , transform: function(key, result, callback){
        var malformed   = false;

        var filtered    = result.filter( function(current) {

            var result  = this.comparator.call(null, key, current);
            malformed   = malformed || result === null;
            return !malformed && result === true;

        }.bind(this));

        if(malformed === true){
            return callback(new Error('Rule format does not match the comparators contract.'), null);
        }

        callback(null, filtered);
    }
};

module.exports = new Class(FilterTransformer);