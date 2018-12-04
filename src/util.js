const readFile = function(filename, reader) {
  let contentOfFile = reader(filename, "utf8").split("\n");
  return contentOfFile;
};

module.exports = {
  readFile,
};
