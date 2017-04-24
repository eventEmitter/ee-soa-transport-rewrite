"use strict";

var Class   = require('ee-class'),
    Types   = require('ee-types');

var Rewrite = require('./Rewrite');

var Path = {

    inherits: Rewrite
    , _name: 'path'

    , _execute: function(request, response, callback){
        const pathname = request.pathname;
        const path = this.path;
        let target = this.value;

        if (Types.regexp(path)) {
            const result = path.exec(pathname);

            if (result && result.length) {
                for (let i = 1, l = result.length; i < l; i++) target = target.replace(new RegExp('\\$'+i, 'ig'), result[i]);
            }
        }
        
        request.pathname = target;

        callback(null);
    }
};

module.exports = new Class(Path);