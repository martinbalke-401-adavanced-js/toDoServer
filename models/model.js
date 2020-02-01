'use strict';

const mongoose = require('mongoose');

class Model {
    constructor(schema) {
        this.schema = schema;
    }

    // CRUD

    create(record) {
        // sanitize
        console.log(record);
        let newRecord = new this.schema(record);
        // save
        return newRecord.save();
    }

    read(_id) {
        if (mongoose.Types.ObjectId.isValid(_id))
            return this.schema.findOne({ _id });
        else return null;
    }

    readFromField(field) {
        return this.schema.find(field);
    }

    update(_id, record) {
        if (mongoose.Types.ObjectId.isValid(_id))
            return this.schema.updateOne({ _id }, record);
        else return null;
    }

    delete(_id) {
        if (mongoose.Types.ObjectId.isValid(_id))
            return this.schema.findByIdAndDelete(_id);
        else return null;
    }
}

module.exports = Model;
