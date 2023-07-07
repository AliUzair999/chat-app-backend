const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    }
})

const todoCheck = new mongoose.model('todos', todoSchema)

module.exports = todoCheck