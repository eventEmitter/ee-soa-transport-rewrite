"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Parameter = {
    inherits: Rewrite
    , _name: 'parameter'

    , _execute: function(request, callback){
        if(!('rewriteParameters' in request)){
            request['rewriteParameters'] = {};
        }

        request.rewriteParameters[this.field] = this.value;
        callback(null);
    }
};

module.exports = new Class(Parameter);