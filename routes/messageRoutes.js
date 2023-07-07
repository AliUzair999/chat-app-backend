const express = require('express')
const router = express.Router()


const {addMessage, getMessages} = require('../controllers/messageControlers')

router.post('/add', addMessage)
router.get('/:userId', getMessages)

module.exports = router