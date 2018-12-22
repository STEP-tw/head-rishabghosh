const generateHeader = function (filePath) {
  return "==> " + filePath + " <==";
};
 
const isOptionLine = function (option) {
  return option === "n";
};
  
const isOptionChar = function (option) {
  return (option === "c");
};

const isOptionValid = function (option) {
  return option === "n" || option === "c";
};

const isFileInvalid = function (filePath, fs) {
  return !fs.existsSync(filePath);
};

const splitSource = function(source, reader, delim) {
  return reader(source, "utf8").split(delim);
};

module.exports = {
  generateHeader,
  isOptionLine,
  isOptionChar,
  isOptionValid,
  splitSource,
  isFileInvalid,
};