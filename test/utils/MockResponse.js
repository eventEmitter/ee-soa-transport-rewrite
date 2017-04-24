
module.exports = function MockResponse() {
    this.headers = {};

    this.isSent = false;



    this.send = function(status) {
        this.isSent = true;
        this.status = status;
    }


    this.hasHeader = function(key){
        return !!this.headers[key];
    };

    this.getHeader = function(key){
        return this.headers[key] || null;
    };

    this.setHeader = function(key, value){
        this.headers[key] = value;
        return this;
    };
};