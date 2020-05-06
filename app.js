const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const phoneVerificationRouter = require("./src");
const router = express.Router();
require('dotenv').config()
const port = process.env.PORT;
//const port = 3000;
server.listen(port, () => console.log("server running on port:" + port));

//broadcast all rider location to user
io.on("connection", (socket) => {
  socket.on("Allriderlocation", (data) => {
    socket.broadcast.emit("riderDetails", data);
    console.log("log all " + JSON.stringify(data));
  });
  //user hails a ride
  // user emits and rider listens for event
  socket.on("hailride", (data) => {
    socket.broadcast.emit("hailride-" + data.riderEmail, data);
    console.log("log all " + JSON.stringify(data));
  });

  // rider accepts or decline ride request
  //rider emits and user listens for event
  socket.on("riderChoice", (data) => {
    socket.broadcast.emit("riderChoice-" + data.userEmail, data);
    console.log("log all " + JSON.stringify(data));
  });

  //track rider location
  //rider always emits new location and the user listens to location change events
  socket.on("myRiderLocation", (data) => {
    socket.broadcast.emit("myRiderLocation-" + data.userEmail, data);
    console.log("log all " + JSON.stringify(data));
  });
});

app.use(express.json());
app.use(phoneVerificationRouter);
