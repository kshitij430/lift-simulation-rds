"use strict";
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const app = express();
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });
app.use(express.static(`${path.join(__dirname, "..", "client")}`));
const server = app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`server started successfully on ${process.env.PORT}`);
});
const io = socketio(server);
io.on("connection", (sock) => {
  console.log(`UsersConnected = ${io.engine.clientsCount}`);
  //   listen to incoming messages
  sock.on("message", (text) => {
    io.emit("message", text);
  });

  sock.on("dom-update", (text) => {
    io.emit("dom-update", text);
  });
});
