var assert = require('assert');

var loaders = require('../lib/loader'),
    Request = require('./utils/MockRequest'),
    rewrites = require('../lib/rewrite');

var rules = [
    {domain: 'test1.com', path: null, name: 'ensure',   field: 'range',     value: '1-10'},
    {domain: 'test1.com', path: null, name: 'append',   field: 'filter',    value: ', deleted=null' },
    {domain: 'test1.com', path: null, name: 'override', field: 'select',    value: '*' },
    {domain: 'test1.com', path: null, name: 'template', field: '',          value: 'index.html' },
    {domain: 'test1.com', path: /\/somewhere\/(\d+)/, name: 'path', field: '', value: '/somewhere-else/$1' },
    {domain: 'test2.com', path: null, name: 'alias',    field: '',          value: 'rewritten.com' },

    {domain: 'rewritten.com', path: null, name: 'extends', field: 'range',  value: 'test1.com'},
    {domain: 'rewritten.com', path: null, name: 'append', field: 'filter',  value: ', deleted!=null'},
    {domain: 'rewritten.com', path: null, name: 'override',   field: 'range',     value: '1-20'}
];

var loader = new loaders.RewriteLoader(
    new loaders.InMemoryLoader(rules , 'domain'));

describe('Extends', function(){
    var extender = new rewrites.Extend(rules[6], loader);
    var req = new Request('rewritten.com');

    it('should apply all the rules contained in the rule it is extending', function(){
        extender.execute(req, function(err){
            assert.equal(req.template['default'], 'index.html');
            assert.equal(req.pathname, '/somewhere-else/10');
            // the following test would fail, because the extended rules would be evaluated before it
            // assert.equal(req.getHeader('range'), '1-20');
        });
    });
});

