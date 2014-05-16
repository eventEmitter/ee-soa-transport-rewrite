"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Extend = {
    inherits: Rewrite

    , init: function initialize(domain, field, value, priority, loader){
        initialize.super.call(this, domain, field, value, priority, loader);
        this._name = 'extend';
    }

    , execute: function(request, callback) {
        this._loader.load(this.value, function(error, rules){

            if(error){
                return callback(error, null);
            }
            rules.execute(request, callback);
        }.bind(this));
    }
};

module.exports = new Class(Extend);