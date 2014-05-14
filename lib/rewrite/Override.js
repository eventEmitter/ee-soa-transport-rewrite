"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Override = {

    inherits: Rewrite

    , init: function initialize(domain, field, value, priority, loader){
        initialize.super.call(this, domain, field, value, priority, loader);
        this._name = 'override';
    }

    , _execute: function(request, callback){
        request.setHeader(this.field, this.value);
        callback(null);
    }
};

module.exports = new Class(Override);