"use strict";

var Class = require('ee-class'),
    Types = require('ee-types');

var Rewrite = {

    _domain:      null
    , _name:      'base_rewrite'
    , _field:     null
    , _value:     null
    , _path:       null
    , _priority:  null
    , _loader:    null

    , _children:  null

    , priority: {
        get: function(){ return this._priority; }
    }

    , length: {
        get: function(){ return this._children.length + 1; }
    }

    , value: {
        get: function() {
            if(Types.function(this._value)){
                return this._value.call(null);
            }
            return this._value;
        }
    }

    , field: {
        get: function() { return this._field; }
    }

    , name: {
        get: function() {return this._name; }
    }

    , path: {
        get: function() {return this._path; }
    }

    , status: {
        get: function() {return this._status; }
    }

    , target: {
        get: function() {return this._target; }
    }

    , init: function(rule, loader){

        rule = rule || {};

        this._domain    = rule.domain;
        this._field     = rule.field;
        this._value     = rule.value;
        this._priority  = rule.priority;
        this._path      = rule.path;
        this._status    = rule.status;
        this._target    = rule.target;
        this._loader    = loader;
        this._children  = [];
    }

    , _execute: function(request, response, callback){
        callback(null);
    }

    , hasChildren: function(){
        return this._children.length > 0;
    }

    , _createChain: function(request, response, callback){
        var length = this._children.length;

        var last = callback;
        var current = last;

        for(var i=length-1 ; i >= 0 ; i--){
            var child = this._children[i];
            current = (function(last, child){
                return function(err, responseWasSent){
                    // if there is an error or the execution is intercepted
                    if (err) {
                        if (err === true) return callback(null, responseWasSent);
                        return callback(err);
                    }
                    child.execute(request, response, last);
                }
            })(last, child);
            last = current;
        }
        return current;
    }


    , execute: function(request, response, callback) {
        var chain = this._createChain(request, response, callback);
        this._execute(request, response, chain);
    }

    , then: function(rewrite){
        this._children.push(rewrite);
        return this;
    }

};

module.exports = new Class(Rewrite);