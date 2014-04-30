"use strict";

var Class = require('ee-class');

var DatabaseLoader = {

    _orm: null

    , init : function initialize(orm){
        this._orm = orm;
    }

    , load: function(domain, callback) {
        this._orm.call({domain:domain}).find(function(err, result){
            callback(err, result)
        });
    }
};

module.exports = new Class(DatabaseLoader);