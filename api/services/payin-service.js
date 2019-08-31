const TrainingModel = require('../models/training');
const ExerciseModel = require('../models/exercise');

const payinDBProvider = require("../db_services/payin-db-service");
const uuid = require('uuid').v4;
const ErrorCode = require("../utilities/errors");
const ExerciseService = require("./payout-service");

module.exports = class PayinService {

    constructor(db_provider = null) {
        this.db_provider = new payinDBProvider();
    }

    async create(training) {
        let method_name = 'PayinService/createTrainig';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - training - ${training}`);
            training.id = uuid();
            training.create_at = new Date().getTime();
            logger.verbose(`${method_name} - parameter - buy_list - ${training}`);
            logger.verbose(`${method_name} - calling TrainingDBProvider/validateTraining`);
            let error = await PayinService.validateTraining(training);
            if (error) {
                logger.error(`${method_name} - training not valid ${error}`);
                return Promise.reject(error);
            }


            training = await this.db_provider.create(training);
            logger.info(`${method_name} - end`);
            return Promise.resolve(training);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create training ${err}`);
            return Promise.reject(err);
        }
    }

    async create(training, work_time_sec, rest_time_sec, number_of_sets) {
        let method_name = 'PayinService/createTrainingWithOutExercises';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - training - ${training}`);
            training.id = uuid();
            training.create_at = new Date().getTime();
            logger.verbose(`${method_name} - parameter - buy_list - ${training}`);
            logger.verbose(`${method_name} - calling TrainingDBProvider/createTrainingWithOutExercises`);
            if (!training.name) {
                training.name = `${work_time_sec} - ${rest_time_sec} - ${number_of_sets}`
            }
            if (error) {
                logger.error(`${method_name} - training not valid ${error}`);
                return Promise.reject(error);
            }

            let exercises = [];
            let i;
            for (i = 0; i < number_of_sets; i++) {
                let exercise_work = new ExerciseModel({name: "work", exercise_duration: work_time_sec});
                let exercise_rest = new ExerciseModel({name: "rest", exercise_duration: rest_time_sec});
                exercises.push(exercise_work);
                exercises.push(exercise_rest);
            }

            training.exercises = exercises;
            training = await this.db_provider.create(training);
            logger.info(`${method_name} - end`);
            return Promise.resolve(training);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create training ${err}`);
            return Promise.reject(err);
        }
    }


    async update(training) {
        let method_name = 'PayinService/updateTraining';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - Training - ${training}`);
            logger.verbose(`${method_name} - calling TrainingDBProvider/updateTraining`);
            let training_updated = await this.db_provider.update(training);
            logger.info(`${method_name} - end`);
            return Promise.resolve(training_updated);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create training ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(training_id) {
        let method_name = 'PayinService/getById';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - training_id - ${training_id}`);
            logger.verbose(`${method_name} - calling TrainingDBProvider/getById`);
            let buy_list = await this.db_provider.getById(training_id);
            logger.info(`${method_name} - end`);
            return buy_list;
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async delete(training_id) {
        let method_name = 'PayinService/deleteBuyList';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - parameter - buy_list_id - ${training_id}`);
            logger.verbose(`${method_name} - calling TrainingDBProvider/delete`);
            let buy_list = await this.db_provider.delete(training_id);
            logger.info(`${method_name} - end`);
            return buy_list;
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    async getList(search_by, order_by, page_number, page_size) {
        let method_name = 'PayinService/createBuyList';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - calling TrainingDBProvider/getListOfBuyList`);
            let buy_lists = await this.db_provider.getList(search_by, order_by, page_number, page_size);

            logger.info(`${method_name} - end`);
            return Promise.resolve(buy_lists);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }




    static async validatePayin(training) {
        let method_name = 'PayinService/validateTraining';
        logger.info(`${method_name} - start`);
        try {
            let error = null;
            if (!training.name) {
                error = ErrorCode.INVALID_TRAINING_NAME;
                return Promise.resolve(error);
            }

            logger.info(`${method_name} - end ${error}`);
            return Promise.resolve(error);
        } catch (err) {
            logger.error(`${method_name} - error Fails to validate training error : ${err}`);
            return Promise.reject(err);
        }
    }




};