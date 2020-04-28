const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const router = express.Router();
const port = process.env.PORT;
server.listen(port, () => console.log("server running on port:" + port));
router.post("/sendMyLocation", async (req, res) => {
  const { longitude, latitude, riderEmail } = req.body;
  io.on("connection", (socket) => {
    socket.emit("clientlocation - " + email, { mylocation:req.body});

    socket.on("return my location", (data) => {
      console.log(data);
    });
  });
});
app.use(express.json());


// app.listen(port, () => {
//     console.log(`Server running on port ${port}`)

// })
