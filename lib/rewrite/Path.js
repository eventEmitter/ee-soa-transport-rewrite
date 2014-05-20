"use strict";

var Class   = require('ee-class'),
    Types   = require('ee-types');

var Rewrite = require('./Rewrite');

var Path = {

    inherits: Rewrite
    , _name: 'path'

    , _execute: function(request, callback){
        var pathname = request.pathname,
            path = this.path,
            target = this.value;

        if(Types.regexp(path)){
            target = pathname.replace(path, this.value);
        }
        request.pathname = target;

        callback(null);
    }
};

module.exports = new Class(Path);