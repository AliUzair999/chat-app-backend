const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')


const {registerUser, loginUser, userDetails, getUsers, getSingle, logoutUser} = require('../controllers/userControlers')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

router.post('/get', getSingle)
router.get('/getUsers', getUsers)
router.post('/userDetails', verifyToken, userDetails)

module.exports = router