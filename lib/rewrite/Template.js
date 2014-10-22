"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Template = {

    inherits: Rewrite
    , _name: 'template'

    , _execute: function(request, callback){
        try {
            request.template = this.value;
        } catch(err) {
            return callback(err);
        }
        callback(null);
    }
};

module.exports = new Class(Template);