"use strict";

let db = require('../mongodb_provider');
let mongo = require('mongodb');
let Payout = require("../../../models/payout");

module.exports = class exerciseProvider extends db.MongoDBProvider {

    constructor() {
        super();
        this.collection_name = 'payout';
    }

    async create(payout, conn) {
        let log_path = 'payout/create';
        logger.info(`${log_path} - start`);
        let is_external_connection = true;
        try {
            logger.verbose(`${log_path} - parameters - payout - ${payout}`);
            this.db_connection = await this.getConnection();
            let exercise_collection = this.db_connection.collection(this.collection_name);
            payout._id = this.uuid2MongoId(payout.id);
            let result = await exercise_collection.insertOne(payout);
            let item = await this.getById(result.insertedId.toString());
            logger.info(`${log_path} - end`);
            return Promise.resolve(item);
        } catch (err) {
            if (is_external_connection === false) {
            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async update(payout, conn = null) {
        let log_path = 'payout/update';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - payout - ${payout}`);
            let update_results = await db.MongoDBProvider.prototype.updateOne.call(this, payout, Payout, null, conn);
            logger.info(`${log_path} - end`);
            return Promise.resolve(update_results);
        } catch (err) {
            logger.err(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async delete(id, conn) {
        let log_path = 'payout/delete';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - payout_id - ${id}`);
            this.db_connection = await this.getConnection();
            var newvalues = {$set: {is_deleted: false}};
            let payout = await this.deleteFromCollection(id, this.db_connection);
            logger.info(`${log_path} - end`);
            return Promise.resolve(payout);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(id, conn) {
        let log_path = 'payout/getById';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - payout_id - ${id}`);
            let payout = await db.MongoDBProvider.prototype.getById.call(this, id, conn);
            logger.info(`${log_path} - end`);
            return Promise.resolve(payout);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getList(search_by, order_by, page_number, page_size, connection) {
        let log_path = 'payout/getList';
        logger.info(`${log_path} - start`);
        try {
            search_by = search_by || '';
            logger.verbose(`${log_path} - parameters - search_by - ${search_by}, order_by - ${order_by}, page_number - ${page_number}, page_size - ${page_size}`);
            let filter = {
                "$and": [
                    {"is_deleted": false},
                    {
                        "$or": [
                            {"name": {"$regex": search_by, "$options": "i"}},
                            {"description": {"$regex": search_by, "$options": "i"}}
                        ]
                    }]
            };
            let payouts = await this.getCollectionList(filter, order_by, page_number, page_size);
            logger.info(`${log_path} - end`);
            return Promise.resolve(payouts);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

};