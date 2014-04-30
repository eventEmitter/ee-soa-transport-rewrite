#ee-soa-transport-rewrite
Middleware to modify requests sent to a service. This module is under heavy development.

Todo: The rule chaining happens "in place" which means the initial rewrite is modified when chained. This should be changed.

##Rewrites
The module provides a basic set of rewrites. Rewrites are executable objects which modify a request based on a rule, to
use the internal rewrites, the rules must at least have the following form:

    var rule = { name: 'ensure', field: 'range', value: '1-10', domain: 'test.com', priority: 1 }

This rule corresponds to an Ensure rewrite which ensures that the passed request has a header named `range` and sets a
default value if not. Rewrites can be executed.

    var rewrite = new Ensure(rule.domain, rule.field, rule.value, rule.priority, loader);
    rewrite.execute(request, function(err){});

Rewrites can be combined to a chain which then is executed sequentially.

    rewrite.then(new Ensure(...)).execute(request, function(err){});

##Loaders
The rewrite module uses loaders to load rules from different sources. All loaders can be nested to combine loading/caching
and transformation.

    var loader =
    {
        load: function(key, callback){
            var ruleset = //load your ruleset
            callback(err, ruleset);
        }
    };


###TransformingLoader
The basic loader takes a loader and a transformer (see transformers). The TransformingLoader passes the rule set returned
by the loader to the transformer, which can transform the passed rules in any desired way before handing it back to the
callback.

###InMemoryLoader
A loader used to load rules from memory i.e. collections of rules. This loader is mainly for testing. The InMemoryLoader
itself is a TransformingLoader which uses a FilterTransformer to reduce the full rule set to the rules which match the
specified key property e.g. `domain`. By default, the property which is taken into account is named `key`.

    var rules  = [
        {domain: 'somewhere.com' ... }
        {domain: 'somewhere-else.com' ...}
        ...
    ];
    var loader = new loaders.InMemoryLoader(rules, 'domain');
    loader.load('somewhere.com', function(err, ruleset){ });

###CachedLoader
A loader which takes a cache and another loader. All results returned by the inserted loader are written to the cache
and taken from there if accessed again. This allows caching of slow rule sources such as a database, the network or the
disk.

###DatabaseLoader
Is currently in development, it probably does not make sense to have a default implementation. In our concrete case we
use the `ee-orm` to load rules based on a key. The Database loader is very likely to be changed.

    load: function(domain, callback) {
        this._orm.call({domain:domain}).find(function(err, result){
            callback(err, result)
        });
    }

###RewriteLoader
Is a transforming loader which creates `rewrite.Rewrite` instances (or subclasses) from the rulesets to get executable
rewrites and can be seen as a factory.

##Transformers
Transformers are classes/objects to transform the loaded rulesets (a loader can be its own transformer!). Below an example
of a transformer that simply filters the rules based on the key value passed to the loader, which is more or less how the
`FilterTransformer` works.

    var transformer = {
        transform: function(key, resultset, callback){
            callback(null, resultset.filter(function(current){
                return current.key == key;
            }));
        }
    }

##Caches
Caches used with the cached loader must adhere to a simple interface:

    var cache = {
        has:    function(key){}
        , get:  function(key){}
        , set:  function(key, value){}
    }

Different caches are always injected into the loaders which makes them inherently testable.