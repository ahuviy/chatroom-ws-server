exports.tryParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
};
