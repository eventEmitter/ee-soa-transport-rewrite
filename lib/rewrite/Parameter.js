"use strict";

var Class   = require('ee-class'),
    Types   = require('ee-types'),
    log     = require('ee-log'),
    Rewrite = require('./Rewrite');

var Parameter = {
    inherits: Rewrite
    , _name: 'parameter'

    , _execute: function(request, callback){
        var pathname = request.pathname,
            path = this.path,
            target = this._value,
            val = null;

        if(Types.regexp(path)){
            var match = path.exec(pathname);
            path.lastIndex=0;
            if(Types.function(target)){
                val = target.call(null, match);
            } else {
                val = match;
            }
        } else {
            val = this.value;
        }

        if(!('rewriteParameters' in request)){
            request['rewriteParameters'] = {};
        }

        request.rewriteParameters[this.field] = val;
        callback(null);
    }
};

module.exports = new Class(Parameter);