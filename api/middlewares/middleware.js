var myLogger = function (req, res, next) {
    logger.info(req); //console.log(r)
    return next()
  }

  module.exports = myLogger