{
    "use strict";

    const Class   = require('ee-class');
    const Rewrite = require('./Rewrite');
    const type    = require('ee-types');



    module.exports = new Class({
        inherits: Rewrite


        , _name: 'redirect'



        , _execute: function(request, response, callback) {
            const pathname = request.pathname;
            const path = this.path;
            let target = this.target;
            let pathRegexpResult;

            if (type.regexp(path)) pathRegexpResult = path.exec(pathname);


            if (type.string(target)) {
                if (pathRegexpResult && pathRegexpResult.length) {
                    for (let i = 1, l = pathRegexpResult.length; i < l; i++) target = target.replace(new RegExp('\\$'+i, 'ig'), pathRegexpResult[i]);
                }

                // redirect
                response.setHeader('Location', target);
                response.send(this.status || 303);
            } else if (type.function(target)) {
                target = target(pathRegexpResult, response);

                if (!response.isSent) {
                    response.setHeader('Location', target);
                    response.send(this.status || 303);  
                }
            } else return callback(new Error(`Rewrite rule 'redirect': expected a function or a string as value, got ${type(target)}!`));
            
        

            // interrupt the chain
            callback(true, true);
        }
    });
}