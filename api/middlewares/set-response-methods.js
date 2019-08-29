"use strict";

const createDone = require('../response/done');
const createError = require('../response/error');

const set_response_methods = function (req, res, next) {
    res.done = createDone (req, res);
    res.error = createError (req, res);
   return next();
  }

  module.exports = set_response_methods