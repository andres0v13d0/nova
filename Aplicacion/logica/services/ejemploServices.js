const db = require('../../accesodatos');

const findAll = async (tableName) => {
    try {
        return await db[tableName].findAll();
    } catch (error) {
        throw new Error(`Error retrieving records from ${tableName}: ${error.message}`);
    }
};

const findOne = async (tableName, id) => {
    try {
        return await db[tableName].findByPk(id);
    } catch (error) {
        throw new Error(`Error retrieving record from ${tableName} with id ${id}: ${error.message}`);
    }
};

const create = async (tableName, data) => {
    try {
        return await db[tableName].create(data);
    } catch (error) {
        throw new Error(`Error creating record in ${tableName}: ${error.message}`);
    }
};

const update = async (tableName, id, data) => {
    try {
        const record = await findOne(tableName, id);
        if (record) {
            return await record.update(data);
        } else {
            throw new Error(`Record not found in ${tableName} with id ${id}`);
        }
    } catch (error) {
        throw new Error(`Error updating record in ${tableName} with id ${id}: ${error.message}`);
    }
};

const remove = async (tableName, id) => {
    try {
        const record = await findOne(tableName, id);
        if (record) {
            return await record.destroy();
        } else {
            throw new Error(`Record not found in ${tableName} with id ${id}`);
        }
    } catch (error) {
        throw new Error(`Error deleting record from ${tableName} with id ${id}: ${error.message}`);
    }
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
};
