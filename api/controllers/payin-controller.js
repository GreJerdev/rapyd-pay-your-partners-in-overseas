'use strict';

const express = require('express'),
  router = express.Router();
const ExerciseService = require('../services/payout-service');

router.post('/', async (req, res) => {
  try {
    logger.info("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise = req.body;
    exercise = await exercise_service.create_exercise(exercise);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
});

router.get('/:exercise_id', async (req, res) => {
  try {
    logger.info("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise_id = req.params['exercise_id'];
    logger.info(exercise_id)
    let exercise = await exercise_service.get_exercise_by_id(exercise_id);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
})

router.post('/:exercise_id', async (req, res) => {
  try {
    console.log("exercise get ")
    let exercise_service = new ExerciseService();
    req.body.id = req.params['exercise_id'];
    console.log(req.body)
    let exercise = await exercise_service.update_exercise(req.body);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
});

router.get('/', async (req, res) => {
  try {
    console.log("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise_id = req.params['exercise_id'];
    console.log(exercise_id)
    let exercise = await exercise_service.get_exercise_by_id(exercise_id);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
});

router.delete('/:exercise_id', async (req, res) => {
  try {
    console.log("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise_id = req.params['exercise_id'];
    console.log(exercise_id)
    let exercise = await exercise_service.get_exercise_by_id(exercise_id);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
});

router.post('/:exercise_id/addingredient', async (req, res) => {
  try {
    logger.info("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise_id = req.params['exercise_id'];
    logger.info(exercise_id)
    let exercise = await exercise_service.get_exercise_by_id(exercise_id);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
})

router.post('/:exercise_id/addinstructions', async (req, res) => {
  try {
    logger.info("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise_id = req.params['exercise_id'];
    logger.info(exercise_id)
    let exercise = await exercise_service.get_exercise_by_id(exercise_id);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
})


router.post('/:exercise_id/addsteps', async (req, res) => {
  try {
    logger.info("exercise get ")
    let exercise_service = new ExerciseService();
    let exercise_id = req.params['exercise_id'];
    logger.info(exercise_id)
    let exercise = await exercise_service.get_exercise_by_id(exercise_id);
    res.done(exercise);
  } catch (err) {
    res.error(err);
  }
})


module.exports = router; 