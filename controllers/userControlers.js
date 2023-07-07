const userModel = require('../schemas/userSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JwtKey = (process.env.JWTKEY)

module.exports.registerUser = async (req, res) => {
    // console.log(req.body)
    const { username, password } = req.body

    try {
        const existingUser = await userModel.findOne({ username });
        console.log("existingUser>>>", existingUser)

        if (existingUser) {
            // User already exists, handle the error or send a response indicating the conflict
            res.send({
                status: 409,
                message: "Username already exists"
            })
        }
        else {
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPassword = await bcrypt.hash(password, salt)
            // console.log(hashedPassword)

            const newUserCheck = new userModel({ username, password: hashedPassword })
            // console.log("newUserCheck>>>", newUserCheck)
            const newUserRes = await newUserCheck.save()
            // console.log("newUserRes>>>", newUserRes)


            jwt.sign({ userId: newUserRes._id, username }, JwtKey, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    newUserRes,
                    token,
                });
            });
        }

    }
    catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }
}

module.exports.loginUser = async (req, res) => {
    console.log("req.body >>>", req.body)
    const { username, password } = req.body

    try {
        const dbUser = await userModel.findOne({ username })
        // console.log("dbUser>>> ", dbUser)

        if (dbUser) {
            // console.log("dbUser working")
            const dbPassword = dbUser.password
            const paswordCompare = await bcrypt.compare(password, dbPassword)
            // console.log(paswordCompare)
            if (paswordCompare) {
                // console.log("paswordCompare working")

                jwt.sign({ userId: dbUser._id, username }, JwtKey, {}, (err, token) => {
                    res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                        newUserRes: dbUser,
                        token,
                    });
                });
            }
            else {
                // console.log("paswordCompare ELSE working")
                res.send({
                    status: 401,
                    message: "wrong password",
                })
            }
        }
        else {
            // console.log("dbUser else working")
            res.send({
                status: 500,
                message: "No user found",
            })
        }

    }
    catch (e) {
        res.send({
            status: 500,
            message: e.message
        })
    }
}

module.exports.logoutUser = async (req, res) => {

    try {
        // c    onsole.log("logout working")
        res.cookie("token", "", { sameSite: 'none', secure: true }).json('ok')
    }
    catch (e) {
        res.send({
            status: 500,
            message: e.message
        })
    }
}

module.exports.getSingle = async (req, res) => {

    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, JwtKey, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
}

module.exports.getUsers = async (req, res) => {

    try {
        const users = await userModel.find()
        // console.log("dbUser>>> ",users)

        res.send({
            status: 200,
            message: "All Users fetched",
            allUsers: users
        })

    }
    catch (e) {
        res.send({
            status: 500,
            message: e.message
        })
    }
}




module.exports.userDetails = async (req, res) => {
    // console.log('userDetails working')
    const { email, password } = req.body

    res.send({
        status: 200,
        message: "userDetails working",

    })

}