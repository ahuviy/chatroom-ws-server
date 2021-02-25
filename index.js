const { tryParseJSON, receivedBadMsgError } = require("./utils");
const port = process.env.PORT || 8080;
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port }, () => {
  console.log("ws server is listening on port", port);
});

wss.on("connection", (ws, req) => {
  const ip = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(/\s*,\s*/)[0]
    : req.socket.remoteAddress;
  console.log("connected to:", ip);

  ws.on("message", (data) => {
    if (typeof data !== "string") {
      console.warn("received bad message:", ip, data);
      return ws.send(receivedBadMsgError);
    }

    const msg = tryParseJSON(data);
    console.log("incoming message:", ip, msg);

    const isValidTextMsg =
      msg &&
      typeof msg === "object" &&
      msg.type === "TEXT_MSG" &&
      typeof msg.sender === "string";

    if (!isValidTextMsg) {
      console.warn("received bad message:", ip, data);
      return ws.send(receivedBadMsgError);
    }

    // Broadcast the message to all connected clients.
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        msg.timestamp = Date.now();
        const broadcasted = JSON.stringify(msg);
        console.log("broadcasting message:", broadcasted);
        client.send(broadcasted);
      }
    });
  });
});
