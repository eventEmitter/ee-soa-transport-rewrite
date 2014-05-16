var assert = require('assert');

var FilterLoader = require('../lib/loader/FilterLoader');

var rules = [
    { key: 'key1' },
    { key: 'key2' },
    { key: 'key2' },
    { key: 'key3' }
];

describe('FilterLoader', function(){
    var load = {
        load: function(key, callback){
            callback(null, rules);
        }
    };
    var comparator = function(key, current){
        return current['key'] == key;
    };
    var loader = new FilterLoader(comparator, load);

    loader.load('key2', function(err, result){
        console.log(result);
    });
});