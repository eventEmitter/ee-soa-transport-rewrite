var assert = require('assert');

var FilterLoader    = require('../lib/loader/FilterLoader');

var rules = [
    { key: 'key1', option: 'key2'},
    { key: 'key2', option: 'key3'},
    { key: 'key2', option: 'key1' },
    { key: 'key3', option: 'key1' }
];

describe('FilterLoader', function(){
    var load = {
        load: function(key, callback){
            callback(null, rules);
        }
    };
    describe('with a default setup', function(){

        describe('load()', function(){

            var loader = new FilterLoader(null, load);
            loader.load('key2', function(err, result){
                it('filters the rules by key property', function(){
                    assert(result.length == 2);
                    assert.deepEqual(result[0], rules[1]);
                    assert.deepEqual(result[1], rules[2]);
                });
            });
        });
    });

    describe('with a custom comparator', function(){

        describe('load()', function(){

            var loader = new FilterLoader(function(key, current){
                return current.option == key;
            }, load);
            loader.load('key1', function(err, result){
                it('uses the passed comparator', function(){
                    assert(result.length == 2);
                    assert.deepEqual(result[0], rules[2]);
                    assert.deepEqual(result[1], rules[3]);
                });
            });
        });
    });

    describe('with custom key preparation functions', function(){

        describe('load()', function(){
            var inner = {
                load: function(key, callback){
                    callback(null, rules.filter(function(current){
                        return current.key == key;
                    }));
                }
            };

            var loader = new FilterLoader(function(key, current){
                    return current.option == key;
                },
                inner,
                {
                    prepareLoaderKey: function(key){
                        return key[0];
                    },
                    prepareFilterKey: function(key){
                        return key[1];
                    }
            });

            loader.load(['key2', 'key1'], function(error, result){
                it('should filter by the returned key (useful for compound keys)', function(){

                    assert.equal(error, null);
                    assert.equal(result.length, 1);
                    assert.deepEqual(result[0], rules[2]);
                });
            });
        });
    });
});