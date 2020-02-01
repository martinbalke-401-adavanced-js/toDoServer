'use strict';

const Model = require('./model.js');
const schema = require('./task-schema.js');

class Tasks extends Model {
    constructor() {
        super(schema);
    }
}

module.exports = Tasks;
