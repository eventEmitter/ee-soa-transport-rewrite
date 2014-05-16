"use strict";

var Class = require('ee-class'),
    Types = require('ee-types');

var Comparator = require('../comparator');

var FilterTransformer = {

    comparator: null

    , init: function(comp){
        this.comparator = Comparator.createComparator(comp);
    }

    , transform: function(key, result, callback){
        try {
            var filtered = result.filter(function(current){

                var result = this.comparator.call(null, key, current);
                return result === true;

            }.bind(this));
            callback(null, filtered);
        } catch(err) {
            callback(err, null);
        }
    }
};

module.exports = new Class(FilterTransformer);