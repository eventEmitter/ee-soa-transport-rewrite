var   assert      = require('assert')
    , log       = require('ee-log');

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
        base    = new rewrites.Append({domain:'test.com', field:'filter', value:', deleted=null'}),
        app     = new rewrites.Append({domain:'test.com', field:'filter', value:', deleted=null'}),
        overr   = new rewrites.Override({domain:'test.com', field:'override', value:'overwritten'}),
        ens     = new rewrites.Ensure({domain:'test.com', field:'select', value:'*'}),

        template = new rewrites.Template({domain:'test.com', value:'index.nunjucks.html'}),
        path = new rewrites.Path({domain:'test.com', path:/\/somewhere\/(\d+)/, value: '/somewhere-else/$1' }),

        option1 = new rewrites.Option({domain: 'test.com', field:'testosteron', value: true}),
        option2 = new rewrites.Option({domain: 'test.com', field:'something', value: 1000}),
        option3 = new rewrites.Option({domain: 'test.com', field: 'whatTimeIsIt', value: function(){ return 'Flaava Flave'; }}),

        param1 = new rewrites.Parameter({domain: 'test.com', field:'testosteron', value: true}),
        param2 = new rewrites.Parameter({domain: 'test.com', field:'something', value: 1000}),
        param3 = new rewrites.Parameter({domain: 'test.com', field: 'whatTimeIsIt', value: function(){ return 'Flaava Flave'; }}),
        param4 = new rewrites.Parameter({domain: 'test.com', path: /\/images\/(\d)(\d).*/, field: 'matches', value: function(match){ return match; }}),
        imageParam = new rewrites.Parameter(
            {
                domain: 'test.com',
                path: /\/images\/(\d+)\/[^\/]*\/([^\/]*)\/(\d+)\/(\d+)/,
                field: 'imageurl',
                value: function(match){
                    return {
                        id: match[1],
                        mode:match[2],
                        height:match[3],
                        width:match[4]
                    };
                }});


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
            var templateWithStatusCode = new rewrites.Template({field:404, value:'error/404.html'});
            assert(!MockRequest.template);
            it('should set should a template property (an object)', function(done){
                template.execute(MockRequest, function(err){
                    assert(MockRequest.template);
                    done(err);
                });
            });

            it('with the template bound to the "default" key if no field is set', function(){
                assert('default' in MockRequest.template);
                assert.equal('index.nunjucks.html', MockRequest.template['default']);
            });

            it('or a key such as an error key if one is set', function(done){
                templateWithStatusCode.execute(MockRequest, function(err){
                    assert('404' in MockRequest.template);
                    assert.equal('error/404.html', MockRequest.template['404']);
                    done(err);
                });
            });

            it('without modifying the existing templates', function(){
                assert('default' in MockRequest.template);
                assert.equal('index.nunjucks.html', MockRequest.template['default']);
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

    describe('Path', function(){
        describe('#execute', function(){
            assert.equal('/somewhere/10', MockRequest.pathname);
            it('should transform the path', function(){
                path.execute(MockRequest, function(err){
                    assert.equal(null, err);
                    assert.equal('/somewhere-else/10', MockRequest.pathname);
                });
            });
        });
    });

    describe('Option', function(){
        describe('#execute', function(){
            option1.then(option2).then(option3);

            option1.execute(MockRequest, function(err){
                assert(!err);
                it('should append a rewriteOptions object', function(){
                    assert('rewriteOptions' in MockRequest);
                });

                it('should have set the values', function(){
                    assert.strictEqual(MockRequest.rewriteOptions['testosteron'], true);
                    assert.strictEqual(MockRequest.rewriteOptions['something'], 1000);
                });

                it('and invoke functions', function(){
                    assert.strictEqual(MockRequest.rewriteOptions['whatTimeIsIt'], 'Flaava Flave');
                });
            });
        });
    });

    describe('Parameter', function(){
        describe('#execute', function(){
            param1.then(param2).then(param3).then(param4).then(imageParam);

            var req = new Request('test.com', '/images/100/some-seo-name/crop/800/600');
            param1.execute(req, function(err){
                assert(!err);
                it('should append a rewriteParameters object', function(){
                    assert('rewriteParameters' in req);
                });

                it('should have set the values', function(){
                    assert.strictEqual(req.rewriteParameters['testosteron'], true);
                    assert.strictEqual(req.rewriteParameters['something'], 1000);
                });

                it('and invoke functions', function(){
                    assert.strictEqual(req.rewriteParameters['whatTimeIsIt'], 'Flaava Flave');
                });

                it('and pass the match object if it is a regexp in the path', function(){
                    var match = req.rewriteParameters['matches'];
                    assert.equal(match[1], '1');
                    assert.equal(match[2], '0');
                });

                it('and pass the match object to the function and evaluate it', function(){
                    var match = req.rewriteParameters['imageurl'];
                    assert.deepEqual(match, { id: '100', mode: 'crop', height: '800', width: '600' });
                });
            });

        });
    });

    describe('Method', function(){
        describe('#execute', function(){
            var   getToPut = new rewrites.Method({domain:'test.com', path:null, field: 'GET', value: 'Put'})
                , toPut     = new rewrites.Method({domain: 'test.com', path: null, value: 'Put'})
                , request   = new Request('test.com')
                , requestPost = new Request('test.com', null, 'post');

            it('should leave requests that do not match the incoming method untouched', function(done){
                getToPut.execute(requestPost, function(err){
                    assert.equal('post', requestPost.method);
                    done(err);
                });
            });

            it('should act case insensitively and set the correct new method it the incoming method matches', function(done){
                getToPut.execute(request, function(err){
                    assert.equal('put', request.method);
                    done(err);
                });
            });

            it('should modify every request if the incoming method is not set', function(done){
                toPut.execute(requestPost, function(err){
                    assert.equal('put', requestPost.method);
                    done(err);
                });
            });
        });
    });

});