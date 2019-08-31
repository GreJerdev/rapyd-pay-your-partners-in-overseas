const Payout = require('../models/payout');
const ErrorCode = require('../utilities/errors');

let buyListDBProvider = require("../db_services/payout-db-service");
let uuid = require('uuid').v4;


module.exports = class PayoutService {

    constructor(db_provider = null) {
        this.db_provider = db_provider || new buyListDBProvider();
    }

    async createPayout(payout) {
        let method_name = 'PayoutService/createPayout';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - payout - ${payout}`);
            payout.id = uuid();
            payout.create_at = new Date().getTime();
            logger.verbose(`${method_name} - parameter - payout - ${payout}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/createPayout`);
            payout = await this.db_provider.createExercise(payout);
            logger.info(`${method_name} - end`);
            return Promise.resolve(payout);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create payout ${err}`);
            return Promise.reject(err);
        }
    }

    async updatePayout(payout) {
        let method_name = 'PayoutService/updatePayout';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - payout - ${payout}`);
            logger.verbose(`${method_name} - calling payoutDBProvider/updatePayout`);
            let payout_updated = await this.db_provider.updatePayout(payout);
            logger.info(`${method_name} - end`);
            return Promise.resolve(payout_updated);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create payout ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(payout) {
        let method_name = 'PayoutService/getById';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - payout - ${payout}`);
            logger.verbose(`${method_name} - calling PayoutDBProvider/getPayoutById`);
            let buy_list = await this.db_provider.getPayoutById(payout);
            logger.info(`${method_name} - end`);
            return buy_list;
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async deletePayout(exercise_id) {
        let method_name = 'PayoutService/deletePayout';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - buy_list_id - ${exercise_id}`);
            logger.verbose(`${method_name} - calling PayoutDBProvider/deletePayout`);
            let buy_list = await this.db_provider.deleteExercise(exercise_id);
            logger.info(`${method_name} - end`);
            return buy_list;
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async getListPayout(search_by, order_by, page_number, page_size) {
        let method_name = 'PayoutService/createPayout';
        logger.info(`${method_name} - start`);
        try {
            //logger.verbose(`${method_name} - parameter - buy_list - ${search_by, order_by, page_number, page_size}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/getListOfPayout`);
            let buy_lists = await this.db_provider.getList(search_by, order_by, page_number, page_size);

            logger.info(`${method_name} - end`);
            return Promise.resolve(buy_lists);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    static async validatePayouts(exercises_list) {
        let method_name = 'PayoutService/validatePayout';
        logger.info(`${method_name} - start`);
        try {
            let error = null;
            let error_arr = await Promise.all(exercises_list.map(async (exercise) => {
                return PayoutService.validatePayout(exercise)
            }));
            error_arr = error_arr.filter(err => err !=null);
            if (error_arr.length) {
                logger.error(`${method_name} - error ${error_arr}`);
            }
            logger.info(`${method_name} - end ${error}`);

            return Promise.resolve(error_arr.length > 0 ? error_arr[0] : null);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    static async validatePayout(exercise) {
        let method_name = 'PayoutService/validatePayout';
        logger.info(`${method_name} - start`);
        try {
            const exercise_service = new PayoutService();
            let error = null;
            if (!exercise) {
                error = ErrorCode.ERROR_EMPTY_EXERCISE;
            }
            if (!error && exercise.id) {
                try {
                    exercise_service.getById(exercise.id)
                } catch (err) {
                    error = ErrorCode.ERROR_EXERCISE_NOT_FOUND;
                }
            }
            if (!error && !exercise.id) {
                if (!exercise.name && !exercise.description && !exercise.youtupe_link &&
                    exercise.image_steps === {} && (exercise.exercise_duration == null) && exercise.number_of_repetitions == null) {
                    error = ErrorCode.ERROR_EXERCISE_NOT_FOUND;
                }
            }
            if (!error && exercise.exercise_duration && exercise.exercise_duration <= 0) {
                error = ErrorCode.ERROR_EXERCISE_DURATION_SHOULD_BE_POSITIVE;
            }
            if (!error && exercise.number_of_repetitions && exercise.number_of_repetitions <= 0) {
                error = ErrorCode.ERROR_EXERCISE_REPETITIONS_SHOULD_BE_POSITIVE;
            }

            logger.info(`${method_name} - end ${error}`);
            return Promise.resolve(error);
        } catch (err) {
            logger.error(`${method_name} - error Fails in validatePayout ${err}`);
            return Promise.reject(err);
        }
    }


}