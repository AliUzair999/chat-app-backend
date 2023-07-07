const express = require('express')
const router = express.Router()

const {createTodo, readTodo, updateTodo, deleteTodo} = require('../controllers/todoControllers')

router.post('/create', createTodo)
router.get('/read', readTodo)
router.post('/update', updateTodo)
router.post('/delete', deleteTodo)

module.exports = router


