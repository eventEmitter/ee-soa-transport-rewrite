#ee-soa-transport-rewrite

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/ee-soa-transport-rewrite.svg)](https://greenkeeper.io/)
Middleware to modify requests sent to a service. This module is under heavy development.

##Rewrites
The module provides a basic set of rewrites. Rewrites are executable objects which modify a request based on a rule, to
use the internal rewrites, the rules must at least have the following form. The middleware matches the domain and the
path against the current http request to choose rules (see matching).

    var rule = { name: ..., path: ..., field: ..., value: ..., domain: ... }

The `name` of the rule determines the corresponding rewrite class:

  - **append** appends the specified `value` to the header specified in `field`.
  - **ensure** checks if the header specified in `field` is present. If not it is set to `field`.
  - **override** overrides the header `field` with `value`.
  - **method** overrides the method of the request if the `field` value matches the incoming request method (rewrites all if `field` is not set) with its `value`
  - **path** modifies the requested pathname `path` to `value` (use to map to api endpoints).
  - **template** sets a template object on the request and binds the template to a key representing the status code of the response (saved in the `field` property. If no status is set, the template it is bound to a default key).
  - **parameter** allows setting arbitrary values to an parameters hashtable called `rewriteParameters` ( `request.rewriteParameters[field] = value`)

Further planned but not implemented or tested yet are:
  - **extend** extends an existing ruleset

Consider the following example:

    var rule    = { domain: 'test.com', path: '/detail', name: 'ensure', field: 'select', value: '*' }
    // is transformed to
    var rewrite = new Ensure(rule, ...);
    // and executed on the request
    rewrite.execute(request, function(err){});

If the `value` field is of type 'function', it gets executed every time the rewrite rule is applied (e.g. a timing function)

Rewrites can be combined to a chain which then is executed sequentially (for development).

    rewrite.then(new Ensure(...)).execute(request, function(err){});

###Matching
The matching of the `path` of the rules is type based:

    - if the path is `null` or '*' it is applied to all requests (which match the domain)
    - if the path is of type string it is exactly matched e.g. `key == path`
    - if the path is of type RegExp, a regexp matching is performed

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

###FilterLoader
A Loader that takes another loader and filters its results using the passed comparator. The comparator can be either a string
which denotes the name of the rule property which is relevant for matching or a function. The later
takes the key passed to the loader and a rule object to match to. The comparator has to adhere to
the following contract:

    1. Return true if the key can be matched with the rule
    2. Return false if the key can not be matched with the rule
    3. Throw an error if the rule has an unexpected form

If there is no comparator passed, the filter loader creates one itself:
    By default, the property which is taken into account is named `key` (rules are compared by their `key` property).

###TransformingLoader
Takes a transformer (see transformers). The TransformingLoader passes the rule set returned
by the loader to the transformer, which can transform the passed rules in any desired way before handing it back to the
callback.

###InMemoryLoader
A loader used to load rules from memory i.e. collections of rules. This loader is mainly for testing. The InMemoryLoader
itself is a FilterLoader which reduces the full rule set to the rules which match a comparator (which can be passed or
is created internally, see FilterLoader).

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
Is currently in development, it probably does not make sense to have a default implementation.

###RewriteLoader
Is a transforming loader which creates `rewrite.Rewrite` instances (or subclasses) from the rulesets to get executable
rewrites and can be seen as a factory (internally uses the `transformer.FactoryTransformer`.

##Transformers
Transformers are classes/objects to transform the loaded rulesets of a transformer that simply filters the rules based
on the key value passed to the loader.

    var transformer = {
        transform: function(key, resultset, callback){
            callback(null, resultset.filter(function(current){
                return current.key == key;
            }));
        }
    }

    var loader = new TransformingLoader(transformer, {load: function(err, cb){ cb(null, rules}; }};

##Caches
Caches used with the cached loader must adhere to a simple interface:

    var cache = {
        has:    function(key){}
        , get:  function(key){}
        , set:  function(key, value){}
    }

Different caches are always injected into the loaders which makes them inherently testable.

#Changelog
##v0.2.0

    - added the possibility to bind the templates to a status code using the field value (if none set it is bound to a default parameter). The template itself now is an object with a resolve method which takes the status code as a parameter).
    
##v0.1.5

    - added a method rewrite to switch http methods
    
##v0.1.2

    - added Option rewrite rule
    - values which are of type function are evaluated now