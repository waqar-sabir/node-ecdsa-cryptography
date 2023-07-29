const db = require('../../../../db');
const userModel = db.user;

exports.create = async (bodyObj) => {
    return await userModel.create(bodyObj);
};

exports.findOne = async (id) => {
    return await userModel.findByPk(id);
};
