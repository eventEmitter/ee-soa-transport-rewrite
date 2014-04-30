var assert  = require('assert');

var loaders = require('./../lib/loader');

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

var MockCache = {
    reads:     0
    , writes:  0
    , misses:  0

    , storage: {}

    , get: function(key){
        this.reads++;
        return this.storage[key] || null;
    }

    , has: function(key){
        var has = key in this.storage;
        if(has !== true){
            this.misses++;
        }
        return has;
    }

    , set: function(key, value){
        this.writes++;
        this.storage[key] = value;
    }
};

describe('CachedLoader', function() {

    var loader     = new loaders.InMemoryLoader(rules),
        cloader    = new loaders.CachedLoader(MockCache, loader);

    var malformedLoader = new loaders.InMemoryLoader(malformedRules),
        malformedCLoader = new loaders.CachedLoader(MockCache, malformedLoader);

    describe('#load', function(){

        it('should load the set of specified rules', function(){
            cloader.load('key2', function(err, result){
                assert.equal(null, err);
                assert.equal(2, result.length);
                assert.deepEqual(result[0], rules[1]);
                assert.deepEqual(result[1], rules[2]);

                assert.equal(1, MockCache.misses);
                assert.equal(1, MockCache.writes);
                assert.equal(0, MockCache.reads);
            });
        });

        it('should load a second access from the cache', function(){
            cloader.load('key2', function(err, result){
                assert.equal(null, err);
                assert(2, result.length);

                assert.equal(1, MockCache.misses);
                assert.equal(1, MockCache.writes);
                assert.equal(1, MockCache.reads);
            });
        });

        it('should return an empty array if the key is not in the ruleset', function(){
            cloader.load('key10', function(err, result){
                assert.equal(null, err);
                assert.equal(0, result.length);

                assert.equal(2, MockCache.misses);
                assert.equal(2, MockCache.writes);
            });
        });

        it('should pass the error if the ruleset is malformed and not write to the cache', function(){
            malformedCLoader.load('key100', function(err, rules){
                assert(!!err);
                assert.equal(null, rules);

                assert.equal(3, MockCache.misses);
                assert.equal(2, MockCache.writes);
            });
        });
    });
});
