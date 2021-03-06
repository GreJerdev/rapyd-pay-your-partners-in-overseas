"use strict";

let db = require('../mongodb_provider');
let mongo = require('mongodb');
let Payin = require("../../../models/payin");

module.exports = class trainingProvider extends db.MongoDBProvider {

    constructor() {
        super();
        this.collection_name = 'payin';
    }

    async create(training, conn = null) {
        let log_path = 'payin/create';
        logger.info(`${log_path} - start`);
        let is_external_connection = true;
        try {
            logger.verbose(`${log_path} - parameters - training - ${training}`);
            this.db_connection = conn || await this.getConnection();
            let training_collection = this.db_connection.collection(this.collection_name);
            training._id = this.uuid2MongoId(training.id);
            let result = await training_collection.insertOne(training);
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

    async update(payin, conn = null) {
        let log_path = 'payin/update';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - payin - ${payin}`);
            let update_results = await db.MongoDBProvider.prototype.updateOne.call(this, payin, Payin, null, conn);
            logger.info(`${log_path} - end`);
            return Promise.resolve(update_results);
        } catch (err) {
            logger.err(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async delete(id, conn) {
        let log_path = 'payin/delete';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - payin_id - ${id}`);
            this.db_connection = await this.getConnection();
            var newvalues = {$set: {is_deleted: false}};
            let payin = await this.deleteFromCollection(id, this.db_connection);
            logger.info(`${log_path} - end`);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(id, conn) {
        let log_path = 'payin/getById';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - payin_id - ${id}`);
            let training = await db.MongoDBProvider.prototype.getById.call(this, id, conn);
            logger.info(`${log_path} - end`);
            return Promise.resolve(training);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getList(search_by, order_by, page_number, page_size, connection) {
        let log_path = 'payin/getList';
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
            let payins = await this.getCollectionList(filter, order_by, page_number, page_size);
            logger.info(`${log_path} - end`);
            return Promise.resolve(payins);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

};