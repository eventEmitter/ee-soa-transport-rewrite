"use strict";

var Class = require('ee-class'),
    EventEmitter = require('ee-event-emitter'),

    loaders = require('./loader');

/**
 * todo: the middleware will get the rewrites to take into account from a config
 */
var Middleware = {

      inherits: EventEmitter
    , loader: null

    , init: function initialize(loader) {
        this.loader = new loaders.RewriteLoader(loader);
    }

    /**
     * todo: add proper error handling
     * todo: remove all logs
     */
    , request: function(request, response, next){

        var key = request.hostname;
        this.loader.load(key, function(err, result){
            if(err){
                throw err;
            }
            if(result){
                result.execute(request, function(error){
                    if(error){
                        throw error;
                    }
                    next();
                });
            } else {
                next();
            }
        });
    }
};

module.exports = new Class(Middleware);