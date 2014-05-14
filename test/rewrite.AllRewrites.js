var assert      = require('assert');

var rewrites    = require('../lib/rewrite'),
    Request     = require('./utils/MockRequest');


var MockRequest = new Request();

var MockRewrite = {
    executed: 0
    , execute: function(request, callback){
        this.executed ++;
        callback(null);
    }
};

describe('Rewrite', function(){
    var rew     = new rewrites.Rewrite(),
        base    = new rewrites.Append('test.com', 'filter', ', deleted=null'),
        app     = new rewrites.Append('test.com', 'filter', ', deleted=null'),
        overr   = new rewrites.Override('test.com', 'override', 'overwritten'),
        ens     = new rewrites.Ensure('test.com', 'select', '*'),

        template = new rewrites.Template('test.com', 'template', 'index.nunjucks.hmtl');


    it('should do a proper setup', function(){
        assert.equal(1, rew.length);
        assert(!rew.hasChildren());
    });

    it('should execute the callback on execution', function(){
        rew.execute(MockRequest, function(err){
            assert.equal(null, err);
        });
    });

    it('should be able to take children and execute them', function(){
        var req = new Request(),
            re  = base.then(overr).then(ens);

        assert(re.hasChildren());
        assert.equal(3, re.length);

        re.execute(req, function(err){
            assert.equal(null, err);
            assert.equal('overwritten', req.getHeader('override'));
            assert.equal('id > 10, deleted=null', req.getHeader('filter'));
            assert.equal('*', req.getHeader('select'));
        });
    });

    describe('Override', function(){
        describe('#execute', function(){
            assert.equal('toOverride', MockRequest.getHeader('override'));
            it('should override the specified header', function(){
                overr.execute(MockRequest, function(err){
                    assert.equal(null, err);
                    assert.equal('overwritten', MockRequest.getHeader('override'));
                });
            })
        });

    });

    describe('Ensure', function(){

        var langens = new rewrites.Ensure('test.com', 'language', 'fr');

        describe('#execute', function(){
            assert(!MockRequest.hasHeader('select'));
            it('should set the header if absent', function(){
                ens.execute(MockRequest, function(err){
                    assert.equal(null, err);
                    assert.equal('*', MockRequest.getHeader('select'));
                });
            });

            it('should leave present headers untouched', function(){
                langens.execute(MockRequest, function(err){
                    assert.equal(null, err);
                    assert.equal('en', MockRequest.getHeader('language'));
                });
            });
        });

    });

    describe('Template', function(){
        describe('#execute', function(){
            assert(!MockRequest.template);
            it('set the template property', function(){
                template.execute(MockRequest, function(err){
                    assert.equal(null, err);
                    assert.equal('index.nunjucks.hmtl', MockRequest.template);
                });
            });
        });

    });

    describe('Append', function(){

        describe('#execute', function(){
            assert.equal('id > 10', MockRequest.getHeader('filter'));
            it('should append the specified value', function(){
                app.execute(MockRequest, function(err){
                    assert.equal(null, err);
                    assert.equal('id > 10, deleted=null', MockRequest.getHeader('filter'));
                });
            });
        });

    });

});