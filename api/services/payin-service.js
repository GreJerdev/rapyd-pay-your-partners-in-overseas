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

    async createTraining(training) {
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

            this.createExercisesIfNotExist(training.exercises);

            training = await this.db_provider.create(training);
            logger.info(`${method_name} - end`);
            return Promise.resolve(training);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create training ${err}`);
            return Promise.reject(err);
        }
    }

    async createTrainingWithoutExercises(training, work_time_sec, rest_time_sec, number_of_sets) {
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
            let error = await PayinService.validateTrainingWithOutExercises(training, work_time_sec, rest_time_sec, number_of_sets);
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


            this.createExercisesIfNotExist(training.exercises);

            training = await this.db_provider.create(training);
            logger.info(`${method_name} - end`);
            return Promise.resolve(training);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create training ${err}`);
            return Promise.reject(err);
        }
    }


    async updateTraining(training) {
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

    async deleteTraining(training_id) {
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

    async getListTraining(search_by, order_by, page_number, page_size) {
        let method_name = 'PayinService/createBuyList';
        logger.info(`${method_name} - start`);
        try {
            //logger.verbose(`${method_name} - parameter - buy_list - ${search_by, order_by, page_number, page_size}`);
            logger.verbose(`${method_name} - calling TrainingDBProvider/getListOfBuyList`);
            let buy_lists = await this.db_provider.getList(search_by, order_by, page_number, page_size);

            logger.info(`${method_name} - end`);
            return Promise.resolve(buy_lists);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }


    async createExercisesIfNotExist(exercises) {
        let method_name = 'PayinService/createExercisesIfNotExist';
        logger.info(`${method_name} - start`);
        try {
            logger.verbose(`${method_name} - create Exercise-Service`);
            // const exercise_service = new ExerciseService();

            /* await Promise.all(exercises.map(exercise => {
                 logger.verbose(`${method_name} - calling Exercise-Service create exercise`);
                 if (!exercise.id) {
                     exercise = exercise_service.createExercise(exercise);
                 }
                 return exercise;
             }));*/
            logger.info(`${method_name} - end`);
            return Promise.resolve(exercises);
        } catch (err) {
            logger.error(`${method_name} - error Fails to create buy_list ${err}`);
            return Promise.reject(err);
        }
    }

    static async validateTraining(training) {
        let method_name = 'PayinService/validateTraining';
        logger.info(`${method_name} - start`);
        try {
            let error = null;
            if (!training.name) {
                error = ErrorCode.INVALID_TRAINING_NAME;
                return Promise.resolve(error);
            }
            error = await ExerciseService.validateExercises(training.exercises);
            logger.info(`${method_name} - end ${error}`);
            return Promise.resolve(error);
        } catch (err) {
            logger.error(`${method_name} - error Fails to validate training error : ${err}`);
            return Promise.reject(err);
        }
    }

    static async validateTrainingWithOutExercises(training, work_time_sec, rest_time_sec, number_of_sets) {
        let method_name = 'PayinService/validateTrainingWithOutExercises';
        logger.info(`${method_name} - start`);
        try {
            let error = null;
            if (Number.isInteger(work_time_sec) === false) {
                error = ErrorCode.INVALID_TRAINING_NAME;
                return Promise.resolve(error);
            }
            if (Number.isInteger(rest_time_sec) === false) {
                error = ErrorCode.INVALID_TRAINING_NAME;
                return Promise.resolve(error);
            }
            if (Number.isInteger(number_of_sets) === false) {
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