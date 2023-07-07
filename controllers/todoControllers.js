const { default: mongoose } = require('mongoose')
const todoCheck = require('../schemas/todoSchema')

const todos = [
    {
        task: "complete assignment",
        // done: false,
        // selected: false,
    },
    {
        task: "complete another assignment",
        // done: false,
        // selected: false,
    }

]

module.exports.createTodo = async (req, res) => {
    console.log(req.body)
    const { task } = req.body

    const newTodo = new todoCheck({ task })
    const newTodoRes = await newTodo.save()
    console.log('newTodoRes>>>>.', newTodoRes)

    todos.push({ task: req.body.task })



    res.send({
        status: 200,
        message: "createTodo API is working",
        // data: todo
    })
}

module.exports.readTodo = async (req, res) => {
    const allTodoRes = await todoCheck.find()
    console.log("allTodoRes >>>>>", allTodoRes)
    res.send({
        status: 200,
        message: "readTodo API is working",
        data: allTodoRes
    })
}

module.exports.updateTodo = async (req, res) => {
    const {_id, task} = req.body

    const updRes = await todoCheck.updateOne(
        {_id},
        {task}
    )
    


    res.send({
        status: 200,
        message: "updateTodo API is working",
        data: []
    })
}

module.exports.deleteTodo = async (req, res) => {
    const { _id } = req.body
    const delRes = await todoCheck.deleteOne({ _id })
    console.log(delRes)

    res.send({
        status: 200,
        message: "deleteTodo API is working",
        data: []
    })
}

