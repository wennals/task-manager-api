const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
