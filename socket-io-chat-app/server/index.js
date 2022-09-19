const express = require('express');
const app = express()
const http = require("http");
const cors = require("cors");

// import server class from socket io library
const { Server } = require("socket.io")


app.use(cors());

// variable server uses http library to generate server through 'app'
const server = http.createServer(app);

// connect socket io server with express server
// tell server which url the application will be running on & which methods to allow (GET & POST)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// connection event detects/listens for event when user connects to server by socket id.. 

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    });
});

//once server runs console.log message 
server.listen(3001, () => {
    console.log("SERVER RUNNING");
})
