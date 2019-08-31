"use strict";

let ERROR = require('../utilities/errors');
let provider_factory = require('./provider/datebase-provider-factory');
let Payin = require('../models/payin');

module.exports = class PayinService {

    constructor() {
        this.db_connection = new provider_factory('payin')
    }

    async create(payin, conn) {
        let log_path = 'PayinService/create -';
        let is_external_connection = true;
        try {
            let result = await this.db_connection.create(payin);
            logger.verbose(`${log_path} db result - ${result}`);
            payin = new Payin(result);
            return Promise.resolve(payin);
        } catch (err) {
            if (is_external_connection === false) {

            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async update(payin, conn) {
        let log_path = 'PayinService/updateTraining -';
        let is_external_connection = false;
        try {
            if (!conn) {

            }
            let result = await this.db_connection.update(payin, conn);
            return Promise.resolve(new Payin(result));
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async delete(id, conn = null) {
        let log_path = 'PayinService/deletePayin -';
        let is_external_connection = false;
        try {
            if (!conn) {

            }
            let result = await this.db_connection.delete(id, conn);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(payin_id, conn) {
        let log_path = 'PayinService/getById -';
        let training = new Training();

        try {
            let result = await this.db_connection.getById(payin_id);
            if (result) {
                training = new Payin(result);
                return Promise.resolve(training);
            } else {
                logger.error(`${log_path} error - ${payin_id} not found`);
                return Promise.reject(ERROR.ERROR_TRAINING_NOT_FOUND);
            }
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getList(search_by, order_by, page_number, page_size, limit, conn) {
        let log_path = 'PayinService/getListOfTraining -';
        try {
            let result = await this.db_connection.getList(search_by, order_by, page_number, page_size, limit, conn);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }



};