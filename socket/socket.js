// Path
import { Server } from "socket.io";
import http from "http";
import express from "express";

// App
const app = express();

// Server 
const server = http.createServer(app);

// IO
const io =  new Server(server, {
    cors: {
        origin: ["http://localhost:4545"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

export const getRecieverSocketID = recieverID => {
    return userSocketMap[recieverID];
};

const userSocketMap = {}; // { userID: socketID }

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    // Handling User's ID
    const userID = socket.handshake.query.userID;
    if (userID != "undefind") userSocketMap[userID] = socket.id;

    // io.emit() --> using send event to online users
    io.emit("OnlineUsers", Object.keys(userSocketMap));

    // socket.on() --> using to listen all events. Can be used both on client and sever side
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        delete userSocketMap[userID];
        io.emit("OnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };