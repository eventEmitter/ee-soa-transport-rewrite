"use strict";

var   Class   = require('ee-class')
    , Types   = require('ee-types')
    , Rewrite = require('./Rewrite');

var Template = {

    inherits: Rewrite
    , _name: 'template'

    , _execute: function(request, callback){
        try {
            var field = 'default';
            if(!request.template){
                request.template = {};
            }
            if(this.field){
                field = this.field.toString();
            }
            request.template[field] = this.value;
            callback(null);
        } catch(err) {
            callback(err);
        }
    }
};

module.exports = new Class(Template);