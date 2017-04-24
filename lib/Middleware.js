{
    "use strict";

    const EventEmitter = require('ee-event-emitter');
    const loaders = require('./loader');




    module.exports = class RewriteTransportMiddleware extends EventEmitter {



        /**
        * hmm.. creates a loader. passes the laoder passed to this method
        * to the other loader that is created inside this method. the passed 
        * in loader returns a set of rewrite rules loaded form somewhere 
        * to the loder isntantiated here
        * 
        * @param {object} loader exposes a load method that returns rewrite rules
        */
        constructor(loader) {
            super();

            // it's complicated :D loaders.RewriteLoader inherits the TrRansformingLoader which 
            // exposes the the load method used in the request function below. the 
            // RequestRewriteLoader instance is simply stored alongside of a map  of all classes 
            // in the rewrite directory on the this.laoder instance.
            this.loader = new loaders.RewriteLoader(new loaders.RequestRewriteLoader(loader));
        }




        /**
        * this method is called by the webserver an
        * can transfrm the request, send the response 
        * or do nothing
        *
        * @param {object} request the ee-webserver request object
        * @param {object} response the ee-webserver response object
        * @param {function} next function to call if the response was not sent yet
        */
        request(request, response, next) {

            // gets rewrite rules that match the requests domain
            // the rules are instances of the classes in the rewrite
            // directory which will execute one after another once
            // the execute method on the first rule was called
            this.loader.load(request, (err, result) => {
                if (err) throw err;
                else if (result) {

                    // execute the chain of rewrites
                    result.execute(request, response, (error, responseWasSent) => {
                        if (error) throw error;
                        if (!responseWasSent) next();
                    });
                } else next();
            });
        }
    }
}