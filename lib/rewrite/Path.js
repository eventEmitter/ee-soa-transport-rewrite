"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Path = {

    inherits: Rewrite
    , pattern: null
    , _name: 'path'

    , init: function initialize (rule, loader){
        initialize.super.call(this, rule, loader);
        this.pattern = new RegExp(this.field);
    }

    , _execute: function(request, callback){
        var pathname = request.pathname;
        request.pathname = pathname.replace(this.pattern, this.value);
        callback(null);
    }
};

module.exports = new Class(Path);