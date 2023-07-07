const express = require('express')
const router = express.Router()

router.use('/user', require('./routes/userRoutes'))
router.use('/message', require('./routes/messageRoutes'))
// router.use('/todo', require('./routes/todoRoutes'))

module.exports = router