var Class   = require('ee-class');

var loaders     = require('./lib/loader');

function log(){
    console.log(arguments);
}



    var loader = new loaders.InMemoryLoader(
        [
            {domain: 'test1.com', name: 'ensure',   field: 'range', value: '1-10'},
            {domain: 'test1.com', name: 'append',   field: 'filter', value: ', deleted=null' },
            {domain: 'test1.com', name: 'override', field: 'select', value: '*' },
            {domain: 'test2.com', name: 'alias',    field: '', value: 'rewritten.com' },
            {domain: 'rewritten.com', name: 'ensure', field: 'range', value: '1-20'},
            {domain: 'rewritten.com', name: 'append', field: 'filter', value: ', deleted!=null'},
            {domain: 'test2.com', name: 'append', field: 'filter', value: ', nonsense' },
        ]
        , 'domain');



    var rewriteLoader = new loaders.RewriteLoader(loader);
    var Mock = function(){
        this.headers = {
            select: ''
            , filter: 'id > 10'
            , override: 'toOverride'
            , language: 'en'
        };

        this.hasHeader = function(key){
            return !!this.headers[key];
        };

        this.getHeader = function(key, parse){
            return this.headers[key] || null;
        };

        this.setHeader = function(key, value){
            this.headers[key] = value;
            return this;
        };
    };



    var request = new Mock();
    var host = 'test1.com';

    rewriteLoader.load(host, function(err, rules){
        rules.execute(request, function(err){
            console.log(request.getHeader('range'));
            console.log(request.getHeader('filter'));
            console.log(request.getHeader('select'));
        });
    });