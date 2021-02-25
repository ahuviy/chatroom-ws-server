const { tryParseJSON } = require("./utils");
const port = 8080;
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port }, () => {
  console.log("ws server is listening on port", port);
});

console.log("num clients:", wss.clients.size);

wss.on("connection", (ws) => {
  console.log("connected");
  ws.on("message", (data) => {
    if (typeof data !== "string") {
      return console.log("server not handling non-string data");
    }
    console.log("incoming message:", tryParseJSON(data));
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        console.log("sending", data);
        client.send(data);
      }
    });
  });
});
