"use strict";

var Class   = require('ee-class'),
    Rewrite = require('./Rewrite');

var Extend = {
    inherits: Rewrite
    , _name: 'alias'

    , execute: function(request, callback) {
        this._loader.load(this.value, function(error, rules){

            if(error){
                return callback(error, null);
            }
            rules.execute(request, callback);
        }.bind(this));
    }
};

module.exports = new Class(Extend);