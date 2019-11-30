const { verify } = require("jsonwebtoken");

const db = require("./db");

/**
 * Do we need to save call (y/n): n
 */

function Call() {
  this.participants = [];
  this.status = 0; // pending (0), accepted (1), declined (2)
  this.acceptedAt = null;

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

  socketServer.on("request", (req) => {
    const token = req.cookies.find((cookie) => cookie.name === "token").value;

    verify(token, process.env.JWT_SECRET, function(error, decoded) {
      if (error) {
        return req.reject(401);
      }

      const query = 'SELECT id, gender, profile_pic, first_name, last_name FROM "user" WHERE id = $1';
      db.query(query, [decoded.uid])
        .then((result) => {
          const user = result.rows[0];

          const connection = req.accept("json", req.origin);

          if (!connections[user.id]) {
            connections[user.id] = connection;
            console.log("connection was added");
          }

          connection.on("message", function(message) {
            if (message.type === "utf8") {
              message = JSON.parse(message.utf8Data);

              let sendToClient = true;

              switch (message.type) {
                case "call":
                  const call = new Call().addParticipant(user.id);
                  calls.push(call);
                  const { participants, status, acceptedAt } = call;
                  sendTo(message.to, {
                    type: "incomingCall",
                    call: {
                      participants,
                      status,
                      acceptedAt
                    },
                    sdp: message.sdp
                  });
                  sendToClient = false;
                  break;
                case "accept":
                  const _call = calls.find((call) => call.participants.find((p) => p == message.to));
                  _call.status = 1;
                  _call.acceptedAt = new Date().getTime();
                  _call.addParticipant(user.id);
                  sendTo(message.to, { type: "callAccepted", call: _call, sdp: message.sdp });
                  _call.participants.forEach((uid) => {
                    sendTo(uid, {
                      call: _call,
                      type: "callUpdated"
                    });
                  });
                  sendToClient = false;
                  break;
                case "increaseTime":
                  const cal = calls.find((call) =>
                    call.participants.find((p) => {
                      return p == user.id;
                    })
                  );
                  cal.participants.forEach((uid) => {
                    sendTo(uid, {
                      type: "increaseTime",
                      call: cal
                    });
                  });
              }

              if (sendToClient) {
                sendTo(message.to, message);
              }
            }
          });

          connection.on("close", () => {
            delete connections[user.id];
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
  });
};
