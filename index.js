const express = require('express')
const cors = require('cors')
const db = require('./config/db')
require("dotenv").config()
const cookieParser = require('cookie-parser')
const ws = require('ws')
const { connection } = require('mongoose')
const jwt = require('jsonwebtoken')
const JwtKey = (process.env.JWTKEY)
const PORT = (process.env.PORT)


const Message = require('./schemas/messageSchema')

const app = express()

app.use(cors({
    credentials: true,
    origin: [
        "https://64a7bd947137eb3ff22a1aea--uzair-chat.netlify.app",
        "http://localhost:3000",
        "https://uzair-chat.netlify.app",
    ]
}));


app.use(express.json());
app.use(cookieParser());


// const PORT = 5000

db.connection
    .once('open', () => console.log("Mongo DB is connectred"))
    .on("error", (err) => console.log("error >>>>", err))


app.use('/apis', require('./rootRoute'))

app.get('/', function (req, res) {
    res.send({
        status: 200,
        message: "Api is working",
        data: []
    })
})



const server = app.listen(PORT)


const wss = new ws.WebSocketServer({ server })

wss.on("connection", (connection, req) => {
    // connection.send(JSON.stringify({ text: 'Welcome to the WebSocket server!' }));
    // console.log(req.headers)

    //READ USERNAME AND ID FROM THE COOKIE FROM THIS CONNECTION
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                // console.log(token)

                jwt.verify(token, JwtKey, {}, (err, userData) => {
                    if (err) throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                });
            }
        }
    }


    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString())
        // console.log(messageData)
        const { recipient, text } = messageData
        if (recipient && text) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
            });
            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    recipient,
                    sender: connection.userId,
                    id: messageDoc._id,
                })))

        }
    })


    // connection.on('message', (message) => {
    //     const messageData = JSON.parse(message.toString())
    //     console.log(messageData)

    //     const { connectionUsername, connectionuserId } = messageData
    //     connection.userId = connectionuserId
    //     connection.username = connectionUsername

    //     const { recipient, text } = messageData
    //     console.log(recipient, text)
    //     if (recipient && text) {
    //         [wss.clients]
    //             .filter(c => c.userId === recipient)
    //             .forEach(c => c.send(JSON.stringify({ text })))
    //     }

    // })


})


