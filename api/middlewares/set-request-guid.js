"use strict";

const createDone = require('../response/done');
const createError = require('../response/error');
const uuid = require('uuid');

module.exports = function (req, res, next) {
    req.requiest_guid = uuid();
    res.requiest_guid = req.requiest_guid;
    return next();
}
