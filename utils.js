exports.tryParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
};

/** An error to return if we received a badly formatted message from the client. */
exports.receivedBadMsgError = JSON.stringify({
  type: "ERROR",
  msg:
    "server expects JSON stringified messages with this schema: { type: 'TEXT_MSG', msg: <text>, sender: <text> }",
});
