const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
// const {
//     getUsers,
//     clearChat,
//     getMessages,
//     storeMessage,
//     setNotifications,
//     getNotifications,
//     deleteNotification
// } = require("./controller/");

const { UserController, MessageController } = require("./controller/");
const ChatRoom = require("./models/ChatRoom");

const app = express();
app.use(cors());
app.use(bodyParser.json());


/* chat server */
const server = app.listen(8080);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    },
});

io.on('connection', socket => {

    socket.on('join-chat', data => {
        socket.join(data.chatId);
        io.emit('join-chat-req', data);
        ChatRoom.create(data)
    });
    socket.on('join-req-accept', (chatId) => {
        socket.join(chatId);
    });
    socket.on('send-message', async newMessage => {
        socket.to(newMessage.chatId).emit('receive-message', newMessage);
        MessageController.store(newMessage);
        // setNotifications(newMessage.sender,newMessage.receiver );
    })
    socket.on('disconnect', () => {
    });
})


// routes
app.get('/', (req, res) => {
    res.json('hello me');
});
app.get('/userslist', UserController.findAll);
// app.get('/messages/:userId', getMessages);
// app.delete('/messages/:userId', clearChat);
// app.get('/notifications/:id', getNotifications);
// app.delete("/notifications", deleteNotification);
module.exports = app;
