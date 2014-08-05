
module.exports = function MockRequest(hostname, pathname, method) {
    this.headers = {
        select: ''
        , filter: 'id > 10'
        , override: 'toOverride'
        , language: 'en'
    };

    this.hostname = hostname || 'test.ch';
    this.pathname = pathname || '/somewhere/10';
    this.method   = (method) ? method.toLowerCase() : 'get';

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