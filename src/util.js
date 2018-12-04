/*
 * reader should be binded with fs.readFileSync("./"+filename, "utf8");
 * then it will be passed as 2nd arg in readFile function
 */

const readFile = function(filename, reader) {
  let contentOfFile = reader(filename).split("\n");
  return contentOfFile;
};

module.exports = {
  readFile,
};
