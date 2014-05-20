var assert  = require('assert');

var loaders = require('../lib/loader');

/**
 * Simplified ruleset
 */
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

describe('InMemoryLoader', function(){

    var counter         = 0;
    var Loader          = new loaders.InMemoryLoader(rules),
        MalformedLoader = new loaders.InMemoryLoader(malformedRules),
        FilterLoader    = new loaders.InMemoryLoader(malformedRules, 'domain');

    describe('#load', function(){

        it('should load the set of specified rules', function(){
            Loader.load('key2', function(err, result){
                assert.equal(null, err);
                assert.equal(2, result.length);
                assert.equal(result[0], rules[1]);
                assert.equal(result[1], rules[2]);
            });
        });

        it('should return an empty array if the key is not in the ruleset', function(){
            Loader.load('key10', function(err, result){
                assert.equal(null, err);
                assert.equal(0, result.length);
            });
        });

        it('should take a key', function(){
            FilterLoader.load('test.com', function(err, result){
                assert.equal(null, err);
                assert.equal(2, result.length);
                assert.equal(result[0], malformedRules[0]);
                assert.equal(result[1], malformedRules[1]);
            });
        });

        it('should pass the error or the transformer', function(){
            MalformedLoader.load('key10', function(err, rules){
                assert(!!err);
                assert.equal(null, rules);
            });
        });

    });

});
