'use strict';

const config = require( "./api/configuration/config");
//const db = require("./providers/database/mysql_provider");
require("./api/utilities/logger");

const express = require('express');
const app = express();
const load_routes = require('./api/routes/routes');
const init_middleware = require('./api/middlewares/load-middlewares');

init_middleware(app);
load_routes(app, express);

const port = 3000;
app.listen(port);
logger.log('info', `port ${port}, server started`);
