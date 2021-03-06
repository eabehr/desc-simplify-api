import debug from 'debug';
import config from '../config/config';
import db from '../config/db';

const log = debug('db:collections');

export const dbConnection = db(config);

export const dropCollection = (connection, collectionName, cb) => {
    connection.dropCollection(collectionName, () => {
        log(`dropping '${collectionName}' collection`);
        if (cb) {
            cb();
        }
    });
};

export const deleteCollection = async (connection, model, collectionName) => {
    let count = await model
        .find()
        .countDocuments()
        .exec();

    if (count > 0) {
        return await connection.dropCollection(collectionName);
    } else {
        return await Promise.resolve();
    }
};
