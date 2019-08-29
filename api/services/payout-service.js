const Exercise = require('../models/exercise');
const ErrorCode = require('../utilities/errors');

let buyListDBProvider = require("../db_services/payout-db-service");
let uuid = require('uuid').v4;


module.exports = class ExerciseService {

    constructor(db_provider = null) {
        this.db_provider = db_provider || new buyListDBProvider();
    }

    async createExercise(exercise) {
        let method_name = 'ExerciseService/createExercise';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - buy_list - ${exercise}`);
            exercise.id = uuid();
            exercise.create_at = new Date().getTime();
            logger.verbose(`${method_name} - parameter - buy_list - ${exercise}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/createBuyList`);
            exercise = await this.db_provider.createExercise(exercise);
            logger.info(`${method_name} - end`);
            return Promise.resolve(exercise);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async updateExercise(exercise) {
        let method_name = 'ExerciseService/updateExercise';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - buy_list - ${exercise}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/createExercise`);
            let buy_list_updated = await this.db_provider.updateExercise(exercise);
            logger.info(`${method_name} - end`);
            return Promise.resolve(buy_list_updated);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(exercise_id) {
        let method_name = 'ExerciseService/getById';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - buy_list_id - ${exercise_id}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/getExerciseById`);
            let buy_list = await this.db_provider.getExerciseById(exercise_id);
            logger.info(`${method_name} - end`);
            return buy_list;
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async deleteExercise(exercise_id) {
        let method_name = 'ExerciseService/deleteExercise';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - buy_list_id - ${exercise_id}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/deleteExercise`);
            let buy_list = await this.db_provider.deleteExercise(exercise_id);
            logger.info(`${method_name} - end`);
            return buy_list;
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async getListExercise(search_by, order_by, page_number, page_size) {
        let method_name = 'ExerciseService/createExercise';
        logger.info(`${method_name} - start`);
        try {
            //logger.verbose(`${method_name} - parameter - buy_list - ${search_by, order_by, page_number, page_size}`);
            logger.verbose(`${method_name} - calling buyListDBProvider/getListOfExercise`);
            let buy_lists = await this.db_provider.getList(search_by, order_by, page_number, page_size);

            logger.info(`${method_name} - end`);
            return Promise.resolve(buy_lists);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    static async validateExercises(exercises_list) {
        let method_name = 'ExerciseService/validateExercises';
        logger.info(`${method_name} - start`);
        try {
            let error = null;
            let error_arr = await Promise.all(exercises_list.map(async (exercise) => {
                return ExerciseService.validateExercise(exercise)
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

    static async validateExercise(exercise) {
        let method_name = 'ExerciseService/validateExercise';
        logger.info(`${method_name} - start`);
        try {
            const exercise_service = new ExerciseService();
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
            logger.error(`${method_name} - error Fails in validateExercise ${err}`);
            return Promise.reject(err);
        }
    }


}