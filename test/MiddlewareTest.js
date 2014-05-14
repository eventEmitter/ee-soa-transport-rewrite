var assert  = require('assert');

var loaders     = require('../lib/loader'),
    Request     = require('./utils/MockRequest'),
    Middleware  = require('../lib/Middleware');

var loader = new loaders.InMemoryLoader(
    [
        {domain: 'test1.com', name: 'ensure',   field: 'range', value: '1-10'},
        {domain: 'test1.com', name: 'append',   field: 'filter', value: ', deleted=null' },
        {domain: 'test1.com', name: 'override', field: 'select', value: '*' },
        {domain: 'test1.com', name: 'template', field: '', value: 'index.html' },
        {domain: 'test2.com', name: 'alias',    field: '', value: 'rewritten.com' },
        {domain: 'rewritten.com', name: 'ensure', field: 'range', value: '1-20'},
        {domain: 'rewritten.com', name: 'append', field: 'filter', value: ', deleted!=null'},
        {domain: 'test2.com', name: 'append', field: 'filter', value: ', nonsense' },
    ]
    , 'domain');

describe('Middleware', function(){
    var req = new Request('test1.com'),
        mw  = new Middleware(loader);

    describe('on request', function(){
        mw.request(req, null, function(){

            it('should apply ensures', function(){
                assert.equal(req.getHeader('range'), '1-10');
            });

            it('should apply appends', function(){
                assert.equal(req.getHeader('filter'), 'id > 10, deleted=null');
            });

            it('should apply overrides', function(){
                assert.equal(req.getHeader('select'), '*');
            });

            it('should set the template', function(){
                assert.equal(req.template, 'index.html');
            });
        });
    });
});
