"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Method = module.exports = new Class({

      inherits: Rewrite
    , _name: 'method'

    , _execute: function(request, callback){
        if(this._shouldApplyTo(request)){
            request.method = this.value.toLowerCase();
        }
        callback(null);
    }

    , _shouldApplyTo: function(request){
        return (!this.field || (this.field && request.method && request.method.toLowerCase() === this.field.toLowerCase()));
    }
});