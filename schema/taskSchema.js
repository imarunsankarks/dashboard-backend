const mongoose = require('mongoose');

const Schema = mongoose.Schema

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        parentid:{
            type: String,
        },
        description: {
            type: String,
            required: true
        },
        employee: {
            type: String,
            enum: ['Satish', 'Navya', 'Arun'],
            required: true
        },
        status:{
            type: String,
            enum: ['pending', 'in progress', 'completed','incomplete'],
            default: 'pending'
        },
        recurrence:{
            type: String,
            enum: ['none','daily', 'weekly', 'monthly', 'daily recur', 'weekly recur','monthly recur'],
            default: 'none'
        },
        deadline: {
            type: Date,
        }
    },
    { timestamps: true }
)

const Task = mongoose.model('Task', taskSchema)

module.exports = Task