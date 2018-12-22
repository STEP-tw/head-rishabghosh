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
  
const splitSource = function (source, reader) {
  return reader(source, "utf8").split(this);
};
  
const splitByLine = splitSource.bind("\n");
const splitByChar = splitSource.bind("");
  
const isFileInvalid = function (filePath, fs) {
  return !fs.existsSync(filePath);
};

const splitSource1 = function(source, reader, delim) {
  return reader(source, "utf8").split(delim);
};

module.exports = {
  generateHeader,
  isOptionLine,
  isOptionChar,
  isOptionValid,
  splitByLine,
  splitByChar,
  splitSource1,
  isFileInvalid,
};