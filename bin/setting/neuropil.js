'use strict';

var neuropil = require('neuropil');
var profile = require('./profile');
var node_url = require('url');

module.exports = neuropil({
    logger: require('./logger'),

    username: profile.option('username'),
    password: profile.option('password'),
    email: 'i@kael.me',

    port: profile.option('registry_port'),
    host: profile.option('registry')

}).on('request', function(e) {
    e.json && this.logger.debug('json', e.json);

}).on('response', function(e){
    var code = e.res.statusCode;

    this.logger.info(
        '  ',
        this.logger.template('{{magenta method}} {{url}}', {
            url     : e.req.safe_url,
            method  : e.req.method
        }),
        e.err ? 
            '{{red ' + (code || 'ERR') + '}}' : 
            '{{' + ( is_code_success(code) ? 'green' : 'yellow' ) + ' ' + (code || 'OK!') + '}}'
    );

    this.logger.debug(
        '{{magenta ' + e.req.method + '}}',
        node_url.parse(e.req.safe_url).pathname,
        e.err,
        e.body
    );
});


function is_code_success(code){
    return !!code && code >= 200 && code < 300;
}