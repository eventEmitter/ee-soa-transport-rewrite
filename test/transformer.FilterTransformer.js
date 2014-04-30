var assert = require('assert');

var transformers = require('../lib/transformer');

var rules = [
    { key: 'key1' },
    { key: 'key2' },
    { key: 'key2' },
    { key: 'key3' }
];

var malformedRules = [
    { domain: 'test.com' },
    { domain: 'test.com' },
    { domain: 'key2' },
    { domain: 'key3' }
];

describe('FilterTransformer', function(){

    var transformer     = new transformers.FilterTransformer(function(key, current){
            if(!('key' in current)){
                return null;
            }
            return current.key == key;
        }),
        domainFilter    = new transformers.FilterTransformer(function(key, current){
            if(!('domain' in current)){
                return null;
            }
            return current.domain == key;
        });

    it('Should be able to create a working comparator from a key name', function(){
        var keyFilter    = new transformers.FilterTransformer('domain');
    });

    describe('#transform(key, result, callback)', function(){
        it('filters entries with the specified key', function(){
            transformer.transform('key2', rules, function(err, result){
                assert.equal(null, err);
                assert(result.length == 2);
                assert(result[0] === rules[1]);
                assert(result[1] === rules[2]);
            });
        });

        it('returns an empty array if none exists with the specified key', function(){
            transformer.transform('key10', rules, function(err, result){
                assert(err == null);
                assert(result.length == 0);
            });
        });

        it('creates an an error if the passed collection is malformed', function(){
            transformer.transform('key2', malformedRules, function(err, result){
                assert(!!err);
                assert.equal(null, result);
            });
        });

        it('should take the passed comparator into account', function(){
            domainFilter.transform('test.com', malformedRules, function(err, result){
                assert(err == null);
                assert(result.length == 2);
                assert(result[0] === malformedRules[0]);
                assert(result[1] === malformedRules[1]);
            });
        });
    });

});
