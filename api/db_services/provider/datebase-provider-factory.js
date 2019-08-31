"use strict";


let mysql_provider = null;//require('./mysql_provider');
let configuration = require('../../../configuration/config');
const payinMongoDBProvider = require('./mongo/payin-mongo-provider');
const payoutMongoDBProvider = require('./mongo/payout-mongo-provider');

module.exports = function (object_name) {
        switch (configuration.db.use) {
            case 'mongodb':
                return getMongoDBProvider(object_name);
                break;
            case 'mysql':
                return mysql_provider;
                break;
            default:
                return custom_db_provider;
                break;
        }

    function getMongoDBProvider(object_name){
            switch (object_name) {
                case '':
                    break;
                case 'payout':
                    return new payoutMongoDBProvider();
                    break;
                case 'payin':
                    return new payinMongoDBProvider();
                    break;

            }
    }


};