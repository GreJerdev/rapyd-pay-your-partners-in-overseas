'use strict';

const express = require('express'),
  router = express.Router();
const PayoutService = require('../services/payout-service');

router.post('/', async (req, res) => {
  try {
    logger.info("payout get ")
    let payout_service = new PayoutService();
    let payout = req.body;
    payout = await payout_service.create_payout(payout);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
});

router.get('/:payout_id', async (req, res) => {
  try {
    logger.info("payout get ")
    let payout_service = new PayoutService();
    let payout_id = req.params['payout_id'];
    logger.info(payout_id)
    let payout = await payout_service.get_payout_by_id(payout_id);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
})

router.post('/:payout_id', async (req, res) => {
  try {
    console.log("payout get ")
    let payout_service = new PayoutService();
    req.body.id = req.params['payout_id'];
    console.log(req.body)
    let payout = await payout_service.update_payout(req.body);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
});

router.get('/', async (req, res) => {
  try {
    console.log("payout get ")
    let payout_service = new PayoutService();
    let payout_id = req.params['payout_id'];
    console.log(payout_id)
    let payout = await payout_service.get_payout_by_id(payout_id);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
});

router.delete('/:payout_id', async (req, res) => {
  try {
    console.log("payout get ")
    let payout_service = new PayoutService();
    let payout_id = req.params['payout_id'];
    console.log(payout_id)
    let payout = await payout_service.get_payout_by_id(payout_id);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
});

router.post('/:payout_id/addingredient', async (req, res) => {
  try {
    logger.info("payout get ")
    let payout_service = new PayoutService();
    let payout_id = req.params['payout_id'];
    logger.info(payout_id)
    let payout = await payout_service.get_payout_by_id(payout_id);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
})

router.post('/:payout_id/addinstructions', async (req, res) => {
  try {
    logger.info("payout get ")
    let payout_service = new PayoutService();
    let payout_id = req.params['payout_id'];
    logger.info(payout_id)
    let payout = await payout_service.get_payout_by_id(payout_id);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
})


router.post('/:payout_id/addsteps', async (req, res) => {
  try {
    logger.info("payout get ")
    let payout_service = new PayoutService();
    let payout_id = req.params['payout_id'];
    logger.info(payout_id)
    let payout = await payout_service.get_payout_by_id(payout_id);
    res.done(payout);
  } catch (err) {
    res.error(err);
  }
})


module.exports = router; 