'use strict';

const myLogger = require('./middleware');
const set_response_methods = require('./set-response-methods');
const set_resquest_guid = require('./set-request-guid')
const bodyParser = require('body-parser');


module.exports = function (app) {
    app.use(myLogger);
    app.use(set_response_methods);
    app.use(set_resquest_guid);
    app.use(bodyParser.json())
};


