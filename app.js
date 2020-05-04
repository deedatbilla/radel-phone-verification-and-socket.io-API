const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const main = require("./src");
const router = express.Router();
const port = process.env.PORT;
//const port = 3000;
server.listen(port, () => console.log("server running on port:" + port));
// router.post("/sendUserLocation", async (req, res) => {
//   const { longitude, latitude, riderEmail } = req.body;
//   res.send("socket started");
//   io.on("connection", (socket) => {
//     //send user's location to rider
//     socket.emit("clientlocation - " + riderEmail, { Userlocation: req.body });
//     socket.on("return my location", (data) => {
//       console.log(data);
//       //res.send(req.body);
//     });
//   });
// });

// router.post("/sendRiderLocation", async (req, res) => {
//   const { longitude, latitude, userEmail } = req.body;
//   res.send("socket started");
//   io.on("connection", (socket) => {
//     //send the rider's location to user
//     socket.emit("riderlocation - " + userEmail, { Riderlocation: req.body });

//     socket.on("return my location", (data) => {
//       console.log(data);
//       //res.send(req.body);
//     });
//   });
// });

io.on("connection", (socket) => {
  console.log("rider new location");
  socket.emit("Allriderlocation", { uu: "dsfhjdj" });
  socket.on("Allriderlocation", (data) => {
    console.log("testing");

    console.log("log all " + JSON.stringify(data));
  });
});

// router.get("/GetAllRiderLocations", async (req, res) => {
//   res.send("socket started");
//   io.on("connection", (socket) => {
//     //send the rider's location to user
//     socket.emit("Allriderlocation", {
//       latitude: latitude,
//       longitude: longitude,
//     });
//     // socket.on("return my location", (data) => {
//     //   console.log(data);
//     //   //res.send(req.body);
//     // });
//   });
// });
app.use(express.json());
//app.use(router);
