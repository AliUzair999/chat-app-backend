const Message = require('../schemas/messageSchema')
const jwt = require('jsonwebtoken')
const JwtKey = (process.env.JWTKEY)


module.exports.addMessage = async (req, res) => {
    // console.log(req.body)
    const { username, password } = req.body

    try {

    }
    catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }
}


module.exports.getMessages = async (req, res) => {


    try {
        const { userId } = req.params
        let ourUserId

        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, JwtKey, {}, (err, userData) => {
                if (err) throw err;
                ourUserId = userData.userId
            });
            if (ourUserId) {
                const messages = await Message.find({
                    sender: { $in: [userId, ourUserId] },
                    recipient: { $in: [userId, ourUserId] },
                }).sort({ createdAt: 1 });
                // console.log(messages)
                res.json(messages);
            }

        } else {
            res.status(401).json('no token');
        }

    }
    catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }
}
