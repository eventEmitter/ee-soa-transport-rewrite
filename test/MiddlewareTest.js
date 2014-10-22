var assert  = require('assert');

var loaders     = require('../lib/loader'),
    Request     = require('./utils/MockRequest'),
    Middleware  = require('../lib/Middleware');

var loader = new loaders.InMemoryLoader(
    [
        {domain: 'test1.com', path: null, name: 'ensure',   field: 'range', value: '1-10'},
        {domain: 'test1.com', path: null, name: 'append',   field: 'filter', value: ', deleted=null' },
        {domain: 'test1.com', path: null, name: 'override', field: 'select', value: '*' },
        {domain: 'test1.com', path: null, name: 'template', field: '', value: 'index.html' },
        {domain: 'test1.com', path: /\/somewhere\/(\d+)/, name: 'path', field: '', value: '/somewhere-else/$1' },
        {domain: 'test1.com', path: null, name: 'option', field: 'test', value: 'works' },
        {domain: 'rewritten.com', path: null, name: 'ensure', field: 'range', value: '1-20'},
        {domain: 'rewritten.com', path: null, name: 'append', field: 'filter', value: ', deleted!=null'},
        {domain: 'test2.com', path: null, name: 'append', field: 'filter', value: ', nonsense' },
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
                //assert.equal(req.template['default'], 'index.html');
                assert.equal(req.template, 'index.html');
            });

            it('should rewrite a matching path', function(){
                assert.equal(req.pathname, '/somewhere-else/10');
            });

            it('should append options', function(){
                assert(!!req.rewriteOptions);
                assert.equal(req.rewriteOptions['test'], 'works');
            });
        });
    });
});
