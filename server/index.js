require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const WebSocketServer = require("websocket").server;

const authRouter = require("./routes/auth");
const webSocket = require("./webSocket");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: "https://localhost:3000"
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
  })
);

app.use("/api/auth", authRouter);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, function() {
  console.log("Server is listening on http://localhost:5000");
});

const socketServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

webSocket(socketServer);
