const { verify } = require("jsonwebtoken");

function Call() {
  this.participants = [];
  this.status = 0; // pending (0), accepted (1), declined (2)

  this.addParticipant = function(user) {
    this.participants.push(user);
    return this;
  };
}

module.exports = (socketServer) => {
  const connections = {};

  const calls = [];

  const sendTo = (userId, message) => {
    const connection = connections[userId];
    if (connection) {
      connections[userId].sendUTF(JSON.stringify(message));
    }
  };

  // socket stuff
  socketServer.on("request", (req) => {
    const token = req.cookies.find((cookie) => cookie.name === "token").value;

    verify(token, process.env.JWT_SECRET, function(error, decoded) {
      if (error) {
        return req.reject(401);
      }

      const { uid } = decoded;
      const connection = req.accept("json", req.origin);

      if (!connections[uid]) {
        connections[uid] = connection;
      }

      connection.on("message", function(message) {
        if (message.type === "utf8") {
          message = JSON.parse(message.utf8Data);

          let sendToClient = true;

          switch (message.type) {
            // called user request video call with user
            case "videoOffer":
              const call = new Call().addParticipant(uid);
              calls.push(call);
              const { participants, status } = call;
              sendTo(message.to, {
                type: "videoOffer",
                call: {
                  participants,
                  status
                },
                sdp: message.sdp
              });
              sendToClient = false;
              break;
            case "accept":
              const _call = calls.find((call) => call.participants.find((p) => p == message.to));
              _call.status = 1;
              _call.addParticipant(uid);
              sendTo(message.to, { type: "accept", call: _call });
              break;
          }

          if (sendToClient) {
            sendTo(message.to, message);
          }
        }
      });

      connection.on("close", () => {
        delete connections[uid];
      });
    });
  });
};
