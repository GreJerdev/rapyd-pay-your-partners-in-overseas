"use strict";

let ERROR = require('../utilities/errors');
let provider_factory = require('./provider/datebase-provider-factory');
let PayoutModel = require('../models/payout');

module.exports = class ExerciseProvider {

    constructor() {
        this.db_connection = provider_factory('exercise');
    }

    async createExercise(exercise, conn) {
        let log_path = 'ExerciseProvider/createPayout -';
        let is_external_connection = true;
        try {
            let result = await this.db_connection.create(exercise);
            logger.verbose(`${log_path} db result - ${result}`);
            exercise = new PayoutModel(result);
            return Promise.resolve(exercise);
        } catch (err) {
            if (is_external_connection === false) {

            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async updatePayout(exercise, conn) {
        let log_path = 'ExerciseProvider/updatePayout';
        let is_external_connection = false;
        try {
            if (!conn) {

            }
            let result = await this.db_connection.update(buy_list, conn);
            return Promise.resolve(new PayoutModel(result));
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async deleteExercise(id, conn = null) {
        let log_path = 'ExerciseProvider/delete_exercise';
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

    async getPayoutById(payout, conn) {
        let log_path = 'ExerciseProvider/getPayoutById';
        let exercise = new Exercise();

        try {
            let result = await this.db_connection.getById(payout);
            if (result) {
                let payout = new Exercise(result);
                return Promise.resolve(payout);
            } else {
                logger.error(`${log_path} error - ${payout} not found`);
                return Promise.reject(ERROR.ERROR_EXERCISE_NOT_FOUND);
            }
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getPayoutList(search_by, order_by, page_number, page_size, limit, conn) {
        let log_path = 'exercise-provider/getPayoutList';
        try {
            let result = await this.db_connection.getList(search_by, order_by, page_number, page_size, limit, conn);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }



};