"use strict";

let ERROR = require('../utilities/errors');
let provider_factory = require('./provider/datebase-provider-factory');
let Training = require('../models/training');

module.exports = class TrainingService {

    constructor() {
        this.db_connection = new provider_factory('training')
    }

    async create(training, conn) {
        let log_path = 'TrainingProvider/createTraining -';
        let is_external_connection = true;
        try {
            let result = await this.db_connection.create(training);
            logger.verbose(`${log_path} db result - ${result}`);
            training = new Training(result);
            return Promise.resolve(training);
        } catch (err) {
            if (is_external_connection === false) {

            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async update(training, conn) {
        let log_path = 'TrainingProvider/updateTraining -';
        let is_external_connection = false;
        try {
            if (!conn) {

            }
            let result = await this.db_connection.update(training, conn);
            return Promise.resolve(new Training(result));
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async delete(id, conn = null) {
        let log_path = 'training-provider/deleteTraining -';
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

    async getById(training_id, conn) {
        let log_path = 'TrainingProvider/getTrainingById -';
        let training = new Training();

        try {
            let result = await this.db_connection.getById(training_id);
            if (result) {
                training = new Training(result);
                return Promise.resolve(training);
            } else {
                logger.error(`${log_path} error - ${training_id} not found`);
                return Promise.reject(ERROR.ERROR_TRAINING_NOT_FOUND);
            }
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getList(search_by, order_by, page_number, page_size, limit, conn) {
        let log_path = 'TrainingProvider/getListOfTraining -';
        try {
            let result = await this.db_connection.getList(search_by, order_by, page_number, page_size, limit, conn);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async addExercise(exercise_id,list_items ,conn = null) {
        let log_path = 'TrainingProvider/addExercise -';
        let is_external_connection = false;
        try {
            if (!conn) {

            }
            let result = await this.db_connection.additems(buy_list_id,list_items, conn);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

};