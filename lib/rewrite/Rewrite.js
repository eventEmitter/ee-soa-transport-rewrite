"use strict";

var Class = require('ee-class');

var Rewrite = {

    _domain:      null
    , _name:      null
    , _field:     null
    , _value:     null
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
        get: function() { return this._value; }
    }

    , field: {
        get: function() { return this._field; }
    }

    , name: {
        get: function() {return this._name; }
    }

    , init: function(domain, field, value, priority, loader){
        this._domain    = domain;
        this._field     = field;
        this._value     = value;
        this._priority  = priority;
        this._loader    = loader;
        this._children  = [];
        this._name      = 'base_rewrite';
    }

    , _execute: function(request, callback){
        callback(null);
    }

    , hasChildren: function(){
        return this._children.length > 0;
    }

    , _createChain: function(request, callback){
        var length = this._children.length;

        var last = callback;
        var current = last;

        for(var i=length-1 ; i>=0 ; i--){
            var child = this._children[i];
            current = (function(last, child){
                return function(err){
                    // if there is an error or the execution is intercepted
                    if(err){
                        if(err === true){
                            callback(null);
                            return;
                        }
                        callback(err);
                        return;
                    }
                    child.execute(request, last);
                }
            })(last, child);
            last = current;
        }
        return current;
    }


    , execute: function(request, callback) {
        var chain = this._createChain(request, callback);
        this._execute(request, chain);
    }

    , then: function(rewrite){
        this._children.push(rewrite);
        return this;
    }

};

module.exports = new Class(Rewrite);