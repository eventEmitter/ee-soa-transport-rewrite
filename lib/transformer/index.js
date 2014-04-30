var Class = require('ee-class');

module.exports.FilterTransformer =  require('./FilterTransformer');
/*
module.exports.ComposedTransformer = new Class({

    _transformers: null

    , init: function(transformers){
        this._transformers = transformers || [];
    }

    , transform: function(key, result, callback){
        var original    = callback,
            len         = this._transformers.length;

        var last = callback,
            current = last;

        for(var i=len-1;i>=0; i--){
            var trans = this._transformers[i];
            current = (function(last){
                return function(err, result){
                    if(err){
                        return callback(err, null);
                    }
                    trans.transform.call(null, key, result, last);
                };
            })(last);
            last = current;
        }
        current.call(null, null, result);
    }
});*/
