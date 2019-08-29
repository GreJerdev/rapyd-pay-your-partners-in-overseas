'use strict';

const express = require('express'),
    router = express.Router();
const TrainingService = require('../services/payin-service');
const TrainingModel = require('../models/training');

router.post('/', async (req, res) => {
    const method_name = 'training-controller/create training';
    try {
        logger.info("training create ");
        let training_service = new TrainingService();
        let training = TrainingModel.parseFromCreateRequest(req.body);
        logger.silly(training);
        training = await training_service.createTraining(training);
        res.done(TrainingModel.parseToResponse(training));
    } catch (err) {
        res.error(err);
    }
});

router.post('/:work_time/:rest_time/:number_of_sets', async (req, res) => {
    const method_name = 'training-controller/createTraining_work_time_rest_time';
    try {
        logger.info(`${method_name} - start`);
        let training_service = new TrainingService();
        let training = TrainingModel.parseFromCreateRequest(req.body);
        logger.silly(training);
        let work_time = Number(req.params['work_time']);
        let rest_time = Number(req.params['rest_time']);
        let number_of_sets = Number(req.params['number_of_sets']);
        training = await training_service.createTrainingWithoutExercises(training, work_time, rest_time, number_of_sets);
        logger.info(`${method_name} - end`);
        res.done(TrainingModel.parseToResponse(training));
    } catch (err) {
        logger.info(`${method_name} - end`);
        res.error(err);
    }
});


router.get('/:training_id', async (req, res) => {
    const method_name = 'training-controller/get';
    try {
        logger.info("training get ");
        let training_service = new TrainingService();
        let training_id = req.params['training_id'];
        logger.info(training_id);
        let training = await training_service.getById(training_id);
        res.done(training);
    } catch (err) {
        res.error(err);
    }
})

router.post('/:training_id', async (req, res) => {
    const method_name = 'training-controller/update training';
    try {
        logger.info(`${method_name} - start`);
        let training_service = new TrainingService();
        req.body.id = req.params['training_id'];
        logger.verbose(`${method_name} - calling TrainingModel/parseFromUpdateRequest - ${req.body}`);
        let training = TrainingModel.parseFromUpdateRequest(req.body);
        logger.verbose(`${method_name} - training-id : ${training.id}`);
        logger.verbose(`${method_name} - calling TrainingService/updateTraining`);
        training = await training_service.updateTraining(training);
        logger.info(`${method_name} - end`);
        res.done(training);
    } catch (err) {
        logger.info(`${method_name} - error : ${err}`);
        res.error(err);
    }
});


router.delete('/:training_id', async (req, res) => {
    const method_name = 'training-controller/delete';
    try {
        console.log("training_id delete ")
        let training_service = new TrainingService();
        let training_id = req.params['training_id'];
        console.log(training_id)
        let recipe = await training_service.deleteTraining(training_id);
        res.done(recipe);
    } catch (err) {
        res.error(err);
    }
});


module.exports = router; 