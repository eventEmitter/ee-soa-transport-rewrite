"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Template = {

    inherits: Rewrite
    , _name: 'template'

    , _execute: function(request, callback){
        try {
            request.template = this.value;
            callback(null);
        } catch(err) {
            callback(err);
        }
    }
};

module.exports = new Class(Template);