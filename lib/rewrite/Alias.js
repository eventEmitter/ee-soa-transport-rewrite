"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Alias = {

    inherits: Rewrite
    , _name: 'alias'

    , _execute: function(request, callback){
        var aliased = this.value;
        this._loader.load(aliased, function(err, result){
            if(err){
                callback(err, null);
                return;
            }
            if('execute' in result){
                result.execute(request, function(err){
                    if(err){
                        callback(err);
                        return;
                    }
                    // intercept
                    callback(true);
                });
            } else {
                callback(new Error('Insufficient loader for alias rules'), null);
            }
        });
    }
};

module.exports = new Class(Alias);