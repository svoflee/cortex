/**
 * Parser: deps
 * parse the dependencies of a neuron module
 */


var

ext = "js",

/**
 /
    [^.]                    // can't start with `.`, require should not be an object method

    \brequire               // require is the first letter
    \s*                     // whitespaces which allowed by JavaScript grammar
    \(                
        \s*                 // whitespaces which allowed by JavaScript grammar
        (["'])              // `"` or `'`
        ([a-zA-Z0-9-/]+)    // alphabets, numbers, `-` (dash), or `/` (slash), `.` (dot)
        \1                  // matched `"` or `'`
        \s*                 // whitespaces which allowed by JavaScript grammar
    \)                
 /g

 match:
 require('io/ajax')
 
 ignore:
 .require('io/ajax')

*/
REGEX_EXECUTOR_REQUIRE = /[^.]\brequire\s*\(\s*(["'])([a-zA-Z0-9-\/.~]+)\1\s*\)/g,

/**
 * .provide('io/ajax'
 */
REGEX_EXECUTOR_NR_PROVIDE_ONE = /\.provide\s*\(\s*(["'])([a-zA-Z0-9-\/.~]+)\1/g,

/**
 
 /
    \.provide               // must use .provide
    \s*                     // allowed whitespaces
    \(
        \s*                 // allowed whitespaces or line wraps
        \[
            ([a-zA-Z0-9-\/\s,"']+)
        \]
 /g
 
 

 * match:
 * .provide(['io/ajax', 'io/jsonp']         // normal
 * .provide([ 'io/ajax', "io/jsonp" ]       // with more whitespaces
 * .provide([                               // with line wraps
        'io/ajax',
        'io/jsonp'
    ], 
 */
REGEX_EXECUTOR_NR_PROVIDE_MORE = /\.provide\s*\(\s*\[\s*([a-zA-Z0-9-\/'",\s.~]+)\],/g,

/**
 * "abc", 'def', 'ddd" -> ['abc', 'def']
 */
REGEX_EXECUTOR_ARRAY_STRING = /(["'])([a-zA-Z0-9-\/.~]+)\1/g,

pushUnique = require('../util/push-unique');



function parseAllDeps(content){
    var deps = [];
    
    // parse require()
    executor(content, REGEX_EXECUTOR_REQUIRE, 2, deps);
    
    // parse .provide('dep')
    executor(content, REGEX_EXECUTOR_NR_PROVIDE_ONE, 2, deps);
    
    // parse .provide(['dep', 'dep2'])
    executor(content, REGEX_EXECUTOR_NR_PROVIDE_MORE, function(m){
        return executor(m[1], REGEX_EXECUTOR_ARRAY_STRING, 2, []);
    }, deps);
    
    return deps;
};


/**
 * @param {string} content
 * @param {RegExp} regex
 * @param {number|function(){}} fn
    {number} push the match result at the specified index
    {function()} push the return value of the function
 * @param {Array} append
 */
function executor(content, regex, fn, append){
    var m;
    
    if(typeof fn === 'number'){
        while(m = regex.exec(content)){
            pushUnique(append, m[fn]);
        }
        
    }else if(typeof fn === 'function'){
        while(m = regex.exec(content)){
            pushUnique(append, fn(m));
        }
    }
    
    return append;
};


/**
 * normalize dependency identifiers, elimilating relative ids
 */
function santitizeDeps(deps){
    
};


module.exports = function(content){
    return parseAllDeps(content);
};
