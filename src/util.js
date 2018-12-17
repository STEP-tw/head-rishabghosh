const generateHeader = function (filePath) {
  return "==> " + filePath + " <==";
};
  
const isOptionLine = function (firstArg) {
  return (firstArg[1] === "n" || firstArg[0] !== "-" ||
      Number.isInteger(+firstArg) || firstArg === "--");
};
  
const isOptionChar = function (firstArg) {
  return (firstArg[1] === "c");
};
  
const isOptionInvalid = function (firstArg) {
  return !isOptionLine(firstArg) && !isOptionChar(firstArg);
};
  
const splitSource = function (source, reader) {
  return reader(source, "utf8").split(this);
};
  
const splitByLine = splitSource.bind("\n");
const splitByChar = splitSource.bind("");
  
const isFileInvalid = function (filePath, fs) {
  return !fs.existsSync(filePath);
};

module.exports = {
  generateHeader,
  isOptionLine,
  isOptionChar,
  isOptionInvalid,
  splitByLine,
  splitByChar,
  isFileInvalid,
};