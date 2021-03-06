"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Append = {
    inherits: Rewrite
    , _name: 'append'

    , _execute: function(request, response, callback){
        var val;
        if(!request.hasHeader(this.field)){
            val = this.value;
        } else {
            val = request.getHeader(this.field)+this.value;
        }
        request.setHeader(this.field, val);
        callback(null);
    }
};

module.exports = new Class(Append);