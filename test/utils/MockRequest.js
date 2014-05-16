
module.exports = function MockRequest(hostname, pathname) {
    this.headers = {
        select: ''
        , filter: 'id > 10'
        , override: 'toOverride'
        , language: 'en'
    };

    this.hostname = hostname || 'test.ch';
    this.pathname = pathname || '/somewhere/10';

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