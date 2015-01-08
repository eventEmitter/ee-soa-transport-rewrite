"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Extend = module.exports = new Class({

      inherits: Rewrite
    , _name: 'extend'

    , execute: function execute(request, callback) {
        var aliased = this.value;
        this._loader.load(aliased, function(err, result){

            if(err) return callback(err, null);

            if('execute' in result){
                this.then(result);
                execute.super.call(this, request, callback);
            } else {
                callback(new Error('Insufficient loader for extend rules'), null);
            }
        }.bind(this));
    }
});