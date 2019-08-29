"use strict";

let db = require('../mongodb_provider');
let mongo = require('mongodb');
let Exercise = require("../../../models/exercise");

module.exports = class exerciseProvider extends db.MongoDBProvider {

    constructor() {
        super();
        this.collection_name = 'exercise';
    }

    async create(exercise, conn) {
        let log_path = 'exercise/create';
        logger.info(`${log_path} - start`);
        let is_external_connection = true;
        try {
            logger.verbose(`${log_path} - parameters - exercise - ${exercise}`);
            this.db_connection = await this.getConnection();
            let exercise_collection = this.db_connection.collection(this.collection_name);
            exercise._id = this.uuid2MongoId(exercise.id);
            let result = await exercise_collection.insertOne(exercise);
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

    async update(exercise, conn = null) {
        let log_path = 'exercise/update';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - exercise - ${exercise}`);
            let update_results = await db.MongoDBProvider.prototype.updateOne.call(this, exercise, Exercise, null, conn);
            logger.info(`${log_path} - end`);
            return Promise.resolve(update_results);
        } catch (err) {
            logger.err(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async delete(id, conn) {
        let log_path = 'exercise/delete';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - exercise_id - ${id}`);
            this.db_connection = await this.getConnection();
            var newvalues = {$set: {is_deleted: false}};
            let exercise = await this.deleteFromCollection(id, this.db_connection);
            logger.info(`${log_path} - end`);
            return Promise.resolve(result);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(id, conn) {
        let log_path = 'exercise/getById';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - exercise_id - ${id}`);
            let exercise = await db.MongoDBProvider.prototype.getById.call(this, id, conn);
            logger.info(`${log_path} - end`);
            return Promise.resolve(exercise);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getList(search_by, order_by, page_number, page_size, connection) {
        let log_path = 'exercise/getList';
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
            let exercises = await this.getCollectionList(filter, order_by, page_number, page_size);
            logger.info(`${log_path} - end`);
            return Promise.resolve(exercises);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

};