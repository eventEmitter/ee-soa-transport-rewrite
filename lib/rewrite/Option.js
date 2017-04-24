"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Option = {
    inherits: Rewrite
    , _name: 'option'

    , _execute: function(request, response, callback){
        if(!('rewriteOptions' in request)){
            request['rewriteOptions'] = {};
        }

        request.rewriteOptions[this.field] = this.value;
        callback(null);
    }
};
module.exports = new Class(Option);