"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Ensure = {
    inherits: Rewrite
    , _name: 'ensure'

    , _execute: function(request, response, callback){
        if(!request.hasHeader(this.field)){
            request.setHeader(this.field, this.value);
        }
        callback(null);
    }
};

module.exports = new Class(Ensure);