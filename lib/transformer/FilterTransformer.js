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
        var filtered = [];
        try {
            filtered = result.filter(function(current){

                var result = this.comparator.call(null, key, current);
                return result === true;

            }.bind(this));
        } catch(err) {
            return callback(err, null);
        }
        callback(null, filtered);
    }
};

module.exports = new Class(FilterTransformer);