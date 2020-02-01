'use strict';

const mongoose = require('mongoose');

const tasks = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    dateDue: { type: Date },
    priority: { type: Number, required: true, default: 5 },
    isCompleted: { type: Boolean, required: true, default: false },
});


module.exports = mongoose.model('tasks', tasks);
