'use strict';

const express = require('express'),
    router = express.Router();
const PayoutService = require('../services/payout-service');
const PayoutModel = require('../models/payout');

router.post('/', async (req, res) => {
    const method_name = 'payout-controller/create payout';
    try {
        logger.info("payout create ");
        let payout_service = new PayoutService();
        let payout = PayoutModel.parseFromCreateRequest(req.body);
        logger.silly(payout);
        payout = await payout_service.createpayout(payout);
        res.done(PayoutModel.parseToResponse(payout));
    } catch (err) {
        res.error(err);
    }
});

router.post('/:work_time/:rest_time/:number_of_sets', async (req, res) => {
    const method_name = 'payout-controller/createpayout_work_time_rest_time';
    try {
        logger.info(`${method_name} - start`);
        let payout_service = new PayoutService();
        let payout = PayoutModel.parseFromCreateRequest(req.body);
        logger.silly(payout);
        let work_time = Number(req.params['work_time']);
        let rest_time = Number(req.params['rest_time']);
        let number_of_sets = Number(req.params['number_of_sets']);
        payout = await payout_service.createpayoutWithoutExercises(payout, work_time, rest_time, number_of_sets);
        logger.info(`${method_name} - end`);
        res.done(PayoutModel.parseToResponse(payout));
    } catch (err) {
        logger.info(`${method_name} - end`);
        res.error(err);
    }
});


router.get('/:payout_id', async (req, res) => {
    const method_name = 'payout-controller/get';
    try {
        logger.info("payout get ");
        let payout_service = new PayoutService();
        let payout_id = req.params['payout_id'];
        logger.info(payout_id);
        let payout = await payout_service.getById(payout_id);
        res.done(payout);
    } catch (err) {
        res.error(err);
    }
})

router.post('/:payout_id', async (req, res) => {
    const method_name = 'payout-controller/update payout';
    try {
        logger.info(`${method_name} - start`);
        let payout_service = new PayoutService();
        req.body.id = req.params['payout_id'];
        logger.verbose(`${method_name} - calling payoutModel/parseFromUpdateRequest - ${req.body}`);
        let payout = PayoutModel.parseFromUpdateRequest(req.body);
        logger.verbose(`${method_name} - payout-id : ${payout.id}`);
        logger.verbose(`${method_name} - calling payoutService/updatepayout`);
        payout = await payout_service.updatepayout(payout);
        logger.info(`${method_name} - end`);
        res.done(payout);
    } catch (err) {
        logger.info(`${method_name} - error : ${err}`);
        res.error(err);
    }
});


router.delete('/:payout_id', async (req, res) => {
    const method_name = 'payout-controller/delete';
    try {
        console.log("payout_id delete ")
        let payout_service = new PayoutService();
        let payout_id = req.params['payout_id'];
        console.log(payout_id)
        let recipe = await payout_service.deletepayout(payout_id);
        res.done(recipe);
    } catch (err) {
        res.error(err);
    }
});


module.exports = router; 