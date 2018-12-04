/*
 * fs.readFileSync should be passed as 2nd arg in readFile function
 */

const readFile = function(filename, reader) {
  let contentOfFile = reader("./"+filename, "utf8").split("\n");
  return contentOfFile;
};

module.exports = {
  readFile,
};
