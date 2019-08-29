let configuration = require('../../configuration/config');
let mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null,
};


exports.MongoDBProvider = class MongoDBProvider {

    constructor() {
        this.getConnection().then((connection) => {
            this.db_connection = connection;
            logger.info(`mongodb_provider/constructor - db_connection is set`);
        }).catch((err) => {
            logger.info(`mongodb_provider/constructor - connection error - ${err}`);
        });
        this.collection_name = '';
    }

    async connect() {
        try {
            if (!state.db) {
                const url = configuration.db.mongodb.connection_string;
                let client = await MongoClient.connect(url);
                state.db = client.db(configuration.db.mongodb.data_base);
                logger.info(`mongodb_provider/connect - connected to db - url - ${url}`);
            }
            return Promise.resolve()
        } catch (err) {
            logger.error(`mongodb_provider/connect - parameter query -, ${err}`);
            return Promise.reject(err);
        }
    };

    async getConnection() {
        if (!state.db) {
            await this.connect();
        }
        logger.silly(`mongodb_provider/getConnection - is state.db null ? - ${state.db === null}`);
        return state.db;
    };

    async close() {
        try {
            if (state.db) {
                await state.db.close();
                state.db = null;
                state.mode = null;
                this.db_connection = null;
            }
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err)
        }
    };

    async getCollectionList(filter, order, page_number = 0, page_size = 10, collection_name = null, conn = null) {
        let log_path = 'MongoDBProvider/getCollectionList';
        let is_external_connection = true;
        try {
            this.db_connection = await this.getConnection();
            let buy_list_collection = this.db_connection.collection(collection_name || this.collection_name);
            order = order || {'create_at': 1};
            let items = await buy_list_collection.find(filter || {}).sort(order).skip(page_number > 0 ? ((page_number - 1) * page_size) : 0).limit(page_size).toArray();
            logger.verbose(`${log_path} - result items  - ${items}`);
            return Promise.resolve(items);
        } catch (err) {
            if (is_external_connection === false) {
                mysql_provider.rollbackTransaction(conn);
            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async getById(id, collection_name = null, conn = null) {
        let log_path = 'MongoDBProvider/getById';
        logger.info(`${log_path} - start`);
        try {
            logger.verbose(`${log_path} - parameters - buy_list_id - ${id}`);
            this.db_connection = await this.getConnection();
            let collection = this.db_connection.collection(this.collection_name);
            let mongo_id = this.uuid2MongoId(id);
            let object = await collection.findOne({
                $and: [
                    {_id: mongo_id},
                    {"is_deleted": false}
                ]
            });
            logger.info(`${log_path} - end`);
            return Promise.resolve(object);
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }


    async deleteFromCollection(id, collection_name = null, conn = null) {
        let log_path = 'MongoDBProvider/deleteFromCollection';
        let is_external_connection = true;
        try {
            conn = conn || await this.getConnection();
            let collection = conn.collection(collection_name || this.collection_name);
            let mongo_id = new mongo.Binary(Buffer.from(id, 'utf8'));
            let new_value = {$set: {is_deleted: true}};
            let my_query = {_id: mongo_id};
            let result = await collection.updateOne(my_query, new_value);
            logger.verbose(`${log_path} - result items - ${result}`);
            return Promise.resolve(true);
        } catch (err) {
            if (is_external_connection === false) {
                mysql_provider.rollbackTransaction(conn);
            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }

    async updateOne(update_data, model, collection_name = null, conn = null) {
        let log_path = 'MongoDBProvider/updateOne';
        let is_external_connection = true;
        try {
            conn = conn || await this.getConnection();
            let collection = conn.collection(collection_name || this.collection_name);
            let mongo_id = this.uuid2MongoId(update_data.id);
            update_data = this.cleanDataBeforeUpdate(update_data, model);
            let update_values = {$set: update_data};
            let update_query = {
                $and: [
                    {_id: mongo_id},
                    {"is_deleted": false}
                ]
            };
            logger.silly(`${log_path} - calling collection.updateOne`);
            let result = await collection.updateOne(update_query, update_values);
            logger.verbose(`${log_path} - update one result - ${result}`);
            result = await this.getById(update_data.id, conn);
            logger.verbose(`${log_path} - result items - ${result}`);
            return Promise.resolve(result);
        } catch (err) {
            if (is_external_connection === false) {
                mysql_provider.rollbackTransaction(conn);
            }
            logger.error(`${log_path} error - ${err}`);
            return Promise.reject(err);
        }
    }


    cleanDataBeforeUpdate(update_data, model) {
        let log_path = 'MongoDBProvider/cleanDataBeforeUpdate';
        logger.info(`${log_path} - start`);
        try {
            let input_keys = Object.keys(update_data);
            let model_keys = Object.keys(new model());
            input_keys.map((field) => {
                if (model_keys.indexOf(field) == -1) {
                    delete update_data[field]
                }
            });
            update_data["is_deleted"];
            update_data["create_at"];
            logger.info(`${log_path} - end`);
            return update_data;
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            throw err;
        }
    }

    uuid2MongoId(object_id) {
        let log_path = 'MongoDBProvider/uuid2MongoId';
        logger.info(`${log_path} - start`);
        try {
            logger.info(`${log_path} - end`);
            return new mongo.Binary(Buffer.from(object_id, 'utf8'));
        } catch (err) {
            logger.error(`${log_path} error - ${err}`);
            throw err;
        }
    }

};


