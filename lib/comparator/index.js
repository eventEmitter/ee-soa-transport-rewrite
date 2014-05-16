var Types = require('ee-types');

function _createComparator(field){
    return function(key, current){
        // malformed
        if(!(field in current)){
            throw new Error('Malformed Rule');
        }
        return current[field] == key;
    };
};
/**
 * Creates a comparator function from a given string or
 */
module.exports.createComparator = function(comp){
    comp = comp || 'key';
    if(Types.string(comp)){
        return _createComparator(comp);
    }
    return comp;
};