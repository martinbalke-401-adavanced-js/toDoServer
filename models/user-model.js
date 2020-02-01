'use strict';

const Model = require('./model.js');
const schema = require('./user-schema.js');

class Users extends Model {
    constructor() {
        super(schema);
    }
}

module.exports = Users;
