"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Override = {

    inherits: Rewrite

    , _execute: function(request, callback){
        request.setHeader(this.field, this.value);
        callback(null);
    }
};

module.exports = new Class(Override);