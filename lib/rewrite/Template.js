"use strict";

var   Class   = require('ee-class')
    , Types   = require('ee-types')
    , Rewrite = require('./Rewrite');

var Template = module.exports = new Class({

      inherits  : Rewrite
    , _name     : 'template'
    , _default  : '_default'

    , _execute: function(request, response, callback){
        try {
            var templatePath = this.value;
            if(!request.template){
                request.template = this.createTemplateContainer();
            }
            request.template.set(this.field, templatePath);
        } catch(err) {
            return callback(err);
        }
        callback(null);
    }

    , createTemplateContainer: function(){
        var defaultField = this._default;
        return {
              _paths : {}

            , set    : function(status, templatePath){
                if(!status) status = defaultField;
                this._paths[status] = templatePath;
            }

            , get : function(status){
                if(status && Types.string(this._paths[status])) return this._paths[status];
                return this._paths[defaultField];
            }

            , resolve : function(status){
                return this.get(status);
            }
        };
    }
});